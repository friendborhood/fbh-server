const Joi = require('joi');
const { uuid } = require('short-uuid');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { formatKeyToJsonArray } = require('../generic');
const logger = require('../../logger');

const modelName = 'items';
const getAllCategories = async () => {
  const { categories } = await getModel(modelName);
  return categories;
};

const validateItemData = async (data) => {
  logger.info('validating item data : ', data);
  const categories = await getAllCategories();
  logger.info(categories);
  const schema = Joi.object({
    itemName: Joi.string()
      .min(3)
      .max(30)
      .required(),
    categoryName: Joi.string().valid(...categories),
    priceRange: Joi.any().required(),
    imageUrl: Joi.string().uri(),
  });
  await schema.validateAsync(data);
  logger.info('item data is okay');
};
const findAll = async () => {
  logger.info('getting model from db');
  const itemModel = await getModel(modelName);
  return itemModel;
};

const findByName = async (itemName) => {
  const itemModel = await getModel(modelName);
  logger.info(`try find item ${itemName}`);
  const relevantItem = Object.values(itemModel)
    .find((item) => item.itemName === itemName);

  if (!relevantItem) {
    logger.info(`item ${itemName} was not found`);
    return null;
  }
  logger.info(`item ${itemName} was  found `);

  return relevantItem;
};
const findById = async (index) => {
  logger.info('getting model from db');
  const itemModel = await getModel(modelName);
  const relevantItem = itemModel[index];
  if (!relevantItem) {
    logger.info('item was not found');
    return null;
  }
  return relevantItem;
};
const findByCategory = async (categoryName) => {
  const itemModel = await getModel(modelName);
  logger.info(`try to find items in ${categoryName}`);
  logger.info(itemModel);
  const relevantItems = Object.entries(itemModel)
    .filter(([, item]) => item.categoryName === categoryName);

  if (!relevantItems) {
    logger.info(`items in ${categoryName} were not found`);
    return null;
  }
  logger.info(`item in ${categoryName} were found `);

  return formatKeyToJsonArray(relevantItems);
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
  addItem,
  findByCategory,
  findById,
  findByName,
  findAll,
  validateItemData,
  getAllCategories,
  deleteItem,
  patchItem,
};
