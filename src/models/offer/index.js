const { uuid } = require('short-uuid');
const Joi = require('joi');
const { insideCircle, distanceTo } = require('geolocation-utils');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { findById } = require('../item');
const logger = require('../../logger');
const { formatKeyToJsonArray, parseJsonToArrayWithKeys } = require('../generic');
const { findByName } = require('../user');

const modelName = 'offers';
const getDistanceFromOfferToTarget = (offer, target) => {
  const { location: { geoCode: offerGeoCode } } = offer;
  return distanceTo(offerGeoCode, target);
};
const filterOffersByArea = ({ offers, radiusInMeters, targetLocation }) => (offers ? offers.filter(
  (offer) => {
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
    (offerA, offerB) => offerA.lastUpdatedAt - offerB.lastUpdatedAt,
  );
  return offers;
};

const validateOfferData = async (data) => {
  const item = await findById(data.itemId);
  if (!item) {
    throw new Error(`Item with id ${data.itemId} was not found.`);
  }
  const schema = Joi.object({
    description: Joi.string()
      .min(3)
      .max(280)
      .required(),
    imageUrl: Joi.string().uri(),
    itemId: Joi.string()
      .guid().required(),
    priceAsked: Joi.number().integer()
      .required(),
  });
  await schema.validateAsync(data, { allowUnknown: true });
  logger.info('offer data is okay');
};
const enrichOfferData = async (offers) => {
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
  logger.info('getting model from db');
  const offerModel = await getModel(modelName);
  const formattedOffers = parseJsonToArrayWithKeys(offerModel);
  return formattedOffers;
};

const findByOfferId = async (index) => {
  logger.info('getting model from db');
  const offerModel = await getModel(modelName);
  const relevantOffer = offerModel[index];
  if (!relevantOffer) {
    logger.warn('offer was not found');
    return null;
  }
  return relevantOffer;
};
const findByCategory = async (categories) => {
  const offerModel = await getModel(modelName);
  logger.info(`try to find offers in ${categories}`);
  const allOfers = Object.entries(offerModel);
  console.log(allOfers.length);
  const allOffersWithCategory = await Promise.all(allOfers.map(async ([, offer]) => {
    const { categoryName } = await findById(offer.itemId);
    return {
      ...offer,
      category: categoryName,
    };
  }));
  console.log(allOffersWithCategory.length);
  const relevantOffers = allOffersWithCategory
    .filter((offer) => categories.includes(offer.category));
  console.log(relevantOffers.length);
  if (relevantOffers.length === 0) {
    logger.warn(`offers by category ${categories} were not found`);
    return null;
  }
  logger.info(`offers by category ${categories} were found `);

  return formatKeyToJsonArray(relevantOffers);
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
  return enrichedFilteredOffers;
};
module.exports = {
  filterRelevantOffersByDistance,
  sortOffersByDistance,
  sortOffersByDate,
  getOffersInArea,
  addItem,
  findByCategory,
  filterOffersByArea,
  findByOfferId,
  findAll,
  deleteItem,
  patchItem,
  validateOfferData,
};
