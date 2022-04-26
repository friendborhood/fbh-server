const { uuid } = require('short-uuid');
const Joi = require('joi');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { findById } = require('../item');

const modelName = 'offers';

const validateOfferData = async (data) => {
  console.log('validating offer data : ', data);
  const item = await findById(data.itemId);
  if (!item) {
    throw new Error({ msg: `Item with id ${data.itemId} was not found.` });
  }
  const schema = Joi.object({
    description: Joi.string()
      .description()
      .min(3)
      .max(280)
      .required(),
    categoryName: Joi.string()
      .required(),
    imageUrl: Joi.string().uri(),
    itemId: Joi.string()
      .guid().required(),
    priceAsked: Joi.number().integer()
      .min(item.priceRange.min).max(item.priceRange.max)
      .required(),
  });
  await schema.validateAsync(data);
  console.log('offer data is okay');
};

const findAll = async () => {
  console.log('getting model from db');
  const offerModel = await getModel(modelName);
  return offerModel;
};

const findByOfferId = async (index) => {
  console.log('getting model from db');
  const offerModel = await getModel(modelName);
  const relevantOffer = offerModel[index];
  if (!relevantOffer) {
    console.log('offer was not found');
    return null;
  }
  return relevantOffer;
};
const findByCategory = async (categoryName) => {
  const offerModel = await getModel(modelName);
  console.log(`try to find offers in ${categoryName}`);
  console.log(offerModel);
  const relevantOffers = Object.values(offerModel)
    .filter((offer) => offer.categoryName === categoryName);
  if (!relevantOffers) {
    console.log(`offers in ${categoryName} were not found`);
    return null;
  }
  console.log(`offers in ${categoryName} were found `);

  return relevantOffers;
};
const addItem = async (data) => {
  console.log('adding item to db');
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
const deleteItem = async (index) => {
  console.log('deleting item from db');
  await add(modelName, null, index);
};
const patchItem = async (data, itemId) => {
  console.log(`patching item ${itemId}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, itemId);
};
module.exports = {
  addItem, findByCategory, findByOfferId, findAll, deleteItem, patchItem, validateOfferData,
};
