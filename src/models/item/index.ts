import Joi from 'joi';
import { uuid } from 'short-uuid';
import getModel from '../../services/firebase-api/get';
import upsert from '../../services/firebase-api/upsert';
import add from '../../services/firebase-api/add';
import { formatKeyToJsonArray } from '../generic';
import logger from '../../logger';

const modelName = 'items';
export const getAllCategories = async () => {
  const { categories } = await getModel(modelName);
  return categories;
};

export const validateItemData = async (data) => {
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
export const findAll = async () => {
  logger.info('getting model from db');
  const itemModel = await getModel(modelName);
  return itemModel;
};

export const findByName = async (itemName) => {
  const itemModel = await getModel(modelName);
  logger.info(`try find item ${itemName}`);
  const relevantItem = Object.values(itemModel)
    .find((item : any) => item.itemName === itemName);

  if (!relevantItem) {
    logger.warn(`item ${itemName} was not found`);
    return null;
  }
  logger.info(`item ${itemName} was  found `);

  return relevantItem;
};
export const findById = async (index) => {
  logger.info('getting model from db');
  const itemModel = await getModel(modelName);
  const relevantItem = itemModel[index];
  if (!relevantItem) {
    logger.warn('item was not found');
    return null;
  }
  return relevantItem;
};
export const findByCategory = async (categoryName) => {
  const itemModel = await getModel(modelName);
  logger.info(`try to find items in ${categoryName}`);
  logger.info(itemModel);
  const relevantItems = Object.entries(itemModel)
    .filter(([, item] : any) => item.categoryName === categoryName);

  if (relevantItems.length === 0) {
    logger.warn(`items in ${categoryName} were not found`);
    return null;
  } else {
  logger.info(`item in ${categoryName} were found `);
  }

  return formatKeyToJsonArray(relevantItems);
};
export const addItem = async (data) => {
  logger.info('adding item to db');
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
export const deleteItem = async (index) => {
  logger.info('deleting item from db');
  await add(modelName, null, index);
};
export const patchItem = async (data, itemId) => {
  logger.info(`patching item ${itemId}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, itemId);
};
