const { uuid } = require('short-uuid');
const Joi = require('joi');
const { insideCircle, distanceTo } = require('geolocation-utils');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { findById } = require('../item');
const logger = require('../../logger');
const { formatKeyToJsonArray, parseJsonToArrayWithKeys } = require('../generic');

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

const sortOffersByDistance = ({ offers, targetLocation }) => {
  const offersWithDistanceFromUser = offers.map((offer) => ({
    ...offer,
    distanceFromUser: getDistanceFromOfferToTarget(offer, targetLocation),
  }));
  offersWithDistanceFromUser.sort(
    (offerA, offerB) => offerA.distanceFromUser - offerB.distanceFromUser,
  );
  return offersWithDistanceFromUser;
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
      .min(item.priceRange.min).max(item.priceRange.max)
      .required(),
  });
  await schema.validateAsync(data, { allowUnknown: true });
  logger.info('offer data is okay');
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
const findByCategory = async (categoryName) => {
  const offerModel = await getModel(modelName);
  logger.info(`try to find offers in ${categoryName}`);
  const relevantOffers = Object.entries(offerModel)
    .filter(([, offer]) => offer.categoryName === categoryName);
  if (relevantOffers.length === 0) {
    logger.warn(`offers by category ${categoryName} were not found`);
    return null;
  }
  logger.info(`offers by category ${categoryName} were found `);

  return formatKeyToJsonArray(relevantOffers);
};
const addItem = async (data) => {
  logger.info('adding item to db');
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
const deleteItem = async (index) => {
  logger.info('deleting item from db');
  await add(modelName, null, index);
};
const patchItem = async (data, itemId) => {
  logger.info(`patching item ${itemId}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, itemId);
};
const assertCategoryAndFind = async (categoryName) => (categoryName
  ? findByCategory(categoryName) : findAll());
const getOffersInArea = async ({ targetLocation, radius, categoryName = null }) => {
  const relevantOffersByCategory = await assertCategoryAndFind(categoryName);
  const filteredByArea = filterOffersByArea(
    { offers: relevantOffersByCategory, radiusInMeters: radius, targetLocation },
  );
  return filteredByArea;
};
module.exports = {
  sortOffersByDistance,
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
