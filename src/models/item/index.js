const Joi = require('joi');
const { uuid } = require('short-uuid');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');

const modelName = 'items';
const getAllCategories = async () => {
  const { categories } = await getModel(modelName);
  return categories;
};

const validateItemData = async (data) => {
  console.log('validating item data : ', data);
  const categories = await getAllCategories();
  console.log(categories);
  const schema = Joi.object({

    categoryName: Joi.string().valid(...categories),
  });
  await schema.validateAsync(data);
  console.log('user data okay');
};
const findAll = async () => {
  console.log('getting model from db');
  const itemModel = await getModel(modelName);
  return itemModel;
};

const findByName = async (itemName) => {
  const itemModel = await getModel(modelName);
  console.log(`try find item ${itemName}`);
  const relevantItem = Object.values(itemModel)
    .find((item) => item.itemName === itemName);

  if (!relevantItem) {
    console.log(`item ${itemName} was not found`);
    return null;
  }
  console.log(`item ${itemName} was  found `);

  return relevantItem;
};
const findById = async (index) => {
  console.log('getting model from db');
  const itemModel = await getModel(modelName);
  const relevantItem = itemModel[index];
  if (!relevantItem) {
    console.log('item was not found');
    return null;
  }
  return relevantItem;
};
const findByCategory = async (categoryName) => {
  const itemModel = await getModel(modelName);
  console.log(`try to find items in ${categoryName}`);
  console.log(itemModel);
  const relevantItems = Object.values(itemModel)
    .filter((item) => item.categoryName === categoryName);
  if (!relevantItems) {
    console.log(`items in ${categoryName} were not found`);
    return null;
  }
  console.log(`item in ${categoryName} were found `);

  return relevantItems;
};
const addItem = async (data) => {
  console.log('adding item to db');
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
module.exports = {
  addItem,
  findByCategory,
  findById,
  findByName,
  findAll,
  validateItemData,
  getAllCategories,
};
