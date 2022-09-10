const { uuid } = require('short-uuid');
const Joi = require('joi');
const { insideCircle, distanceTo } = require('geolocation-utils');
const { getModel, getFromModelById } = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { findById } = require('../item');
const logger = require('../../logger');
const { parseJsonToArrayWithKeys, formatKeyToJsonArray } = require('../generic');
const { findByName } = require('../user');

const modelName = 'offers';
const getDistanceFromOfferToTarget = (offer, target) => {
  const { location: { geoCode: offerGeoCode } } = offer;
  return distanceTo(offerGeoCode, target);
};
const filterOffersByArea = ({ offers, radiusInMeters, targetLocation }) => (offers ? offers.filter(
  (offer) => {
    if (!offer.location || !offer.location.geoCode) {
      logger.error(`offer ${offer.id} does not have a defined location. it will be excluded.`);
      return false;
    }
    const isInsideCircle = insideCircle(offer.location.geoCode, targetLocation, radiusInMeters);
    return isInsideCircle;
  },
) : []);

const filterRelevantOffersByDistance = ({ offers, targetLocation }) => {
  const offersWithDistanceFromUser = offers.map((offer) => ({
    ...offer,
    distanceFromUser: getDistanceFromOfferToTarget(offer, targetLocation),
  }));
  return offersWithDistanceFromUser;
};

const sortOffersByDistance = ({ offers }) => {
  logger.info('sorting offers by distance');
  offers.sort(
    (offerA, offerB) => offerA.distanceFromUser - offerB.distanceFromUser,
  );
  return offers;
};

const sortOffersByDate = ({ offers }) => {
  logger.info('sorting offers by newest');
  offers.sort(
    (offerA, offerB) => {
      const dateA = new Date(offerA.lastUpdatedAt);
      const dateB = new Date(offerB.lastUpdatedAt);
      return dateA - dateB;
    },
  );
  const reverseOffers = offers.reverse();
  return reverseOffers;
};

const filterEnabledOffers = ({ offers }) => {
  logger.info('filtering out disabled offers');
  return offers.filter((offer) => (
    offer.state !== 'Disabled'));
};

const validateOfferData = async (data) => {
  const item = await findById(data.itemId);
  if (!item) {
    throw new Error(`Item with id ${data.itemId} was not found.`);
  }
  const schema = Joi.object({
    description: Joi.string().allow(null, '').optional(),
    imageUrl: Joi.string().uri(),
    itemId: Joi.string()
      .guid().required(),
    priceAsked: Joi.number().integer()
      .required(),
    location: Joi.any().required(),
  });
  await schema.validateAsync(data, { allowUnknown: true });
  logger.info('offer data is okay');
};
const enrichOfferData = async (offers) => {
  if (offers.length === 0) {
    logger.warn('enrichOfferData got empty offers');
    return null;
  }
  const enrichedOffers = await Promise.all(offers.map(async (offer) => {
    const [itemData, offererUserData] = await Promise.all([
      findById(offer.itemId),
      findByName(offer.offererUserName),
    ]);
    return ({ ...offer, itemData, offererUserData });
  }));
  return enrichedOffers;
};
const findAll = async () => {
  logger.info(`getting ${modelName} model from db`);
  const offerModel = await getModel(modelName);
  const formattedOffers = parseJsonToArrayWithKeys(offerModel);
  return formattedOffers;
};

const findByOfferId = async (id) => {
  logger.info(`getting from model ${modelName} offer ${id}`);
  const relevantOffer = await getFromModelById(modelName, id);

  if (!relevantOffer) {
    logger.warn('offer was not found');
    return null;
  }
  return relevantOffer;
};
const findByCategory = async (categories) => {
  const offerModel = await getModel(modelName);
  logger.info(`try to find offers in ${JSON.stringify(categories)}`);
  const allOfers = Object.entries(offerModel);
  const allOffersWithCategory = await Promise.all(allOfers.map(async ([id, offer]) => {
    const { categoryName } = await findById(offer.itemId);
    return {
      ...offer,
      id,
      category: categoryName,
    };
  }));
  const relevantOffers = allOffersWithCategory
    .filter((offer) => categories.includes(offer.category));
  if (relevantOffers.length === 0) {
    logger.warn(`offers by category ${categories} were not found`);
    return null;
  }
  logger.info(`offers by category ${categories} were found `);

  return relevantOffers;
};
const findByUser = async (userName) => {
  const offerModel = await getModel(modelName);
  logger.info(`try to find offers of ${userName}`);
  const allOffersOfUser = Object.entries(offerModel).filter(([, offer]) => (
    offer.offererUserName === userName));

  if (allOffersOfUser.length === 0) {
    logger.warn(`offers by user ${userName} were not found`);
    return null;
  }
  logger.info(`offers by user ${userName} were found `);

  return formatKeyToJsonArray(allOffersOfUser);
};
const addItem = async (data) => {
  logger.info('adding offer to db');
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
const deleteItem = async (index) => {
  logger.info('deleting offer from db');
  await add(modelName, null, index);
};
const patchItem = async (data, offerId) => {
  logger.info(`patching offer ${offerId}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, offerId);
};

const getOffersInArea = async ({ targetLocation, radius, categories = [] }) => {
  const relevantOffersByCategory = await findByCategory(categories);
  const filteredByArea = filterOffersByArea(
    { offers: relevantOffersByCategory, radiusInMeters: radius, targetLocation },
  );
  const enrichedFilteredOffers = await enrichOfferData(filteredByArea);
  let offersWithOffererData = [];
  if (enrichedFilteredOffers && enrichedFilteredOffers.length > 0) {
    offersWithOffererData = enrichedFilteredOffers.filter((offer) => offer.offererUserData);
  }
  return offersWithOffererData;
};
const getSelfOffers = async ({ userName }) => {
  const relevantOffersByUsername = await findByUser(userName);
  const enrichedFilteredOffers = await enrichOfferData(relevantOffersByUsername);
  return enrichedFilteredOffers;
};

module.exports = {
  filterRelevantOffersByDistance,
  sortOffersByDistance,
  sortOffersByDate,
  getOffersInArea,
  getSelfOffers,
  addItem,
  findByCategory,
  filterOffersByArea,
  filterEnabledOffers,
  findByOfferId,
  findByUser,
  findAll,
  deleteItem,
  patchItem,
  validateOfferData,
};
