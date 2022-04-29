const { uuid } = require('short-uuid');
const Joi = require('joi');
const { insideCircle, distanceTo } = require('geolocation-utils');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { findById } = require('../item');
const logger = require('../../logger');

const modelName = 'offers';
const getDistanceFromOfferToTarget = (offer, target) => {
  const { location: { geoCode: offerGeoCode } } = offer;
  return distanceTo(offerGeoCode, target);
};
const getOffersInArea = ({ offers, radiusInMeters, targetLocation }) => Object.values(offers)
  .filter((offer) => {
    const isInsideCircle = insideCircle(offer.location.geoCode, targetLocation, radiusInMeters);
    return isInsideCircle;
  });

const sortOrdersByDistance = ({ offers, targetLocation }) => Object.values(offers)
  .sort((offerA, offerB) => {
    const distanceFromTargetToA = getDistanceFromOfferToTarget(offerA, targetLocation);
    const distanceFromTargetToB = getDistanceFromOfferToTarget(offerB, targetLocation);
    return distanceFromTargetToA - distanceFromTargetToB;
  });

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
  return offerModel;
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
  logger.info(offerModel);
  const relevantOffers = Object.values(offerModel)
    .filter((offer) => offer.categoryName === categoryName);
  if (!relevantOffers) {
    logger.warn(`offers in ${categoryName} were not found`);
    return null;
  }
  logger.info(`offers in ${categoryName} were found `);

  return relevantOffers;
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
module.exports = {
  getOffersInArea,
  addItem,
  findByCategory,
  findByOfferId,
  findAll,
  deleteItem,
  patchItem,
  validateOfferData,
  sortOrdersByDistance,
};
