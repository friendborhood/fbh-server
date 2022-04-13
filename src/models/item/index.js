const { uuid } = require('short-uuid');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');

const modelName = 'items';

const findAll = async _ => {
  console.log('getting model from db');
  const itemModel = await getModel(modelName);
  return itemModel;
};

const findByName = async (itemName) => {
  const itemModel = await getModel(modelName);
  console.log(`try find item ${itemName}`);
  let relevantItem = null;
  for (const key in itemModel) {
    if (itemModel[key].itemName === itemName) {
      relevantItem = itemModel[key];
      break;
    }
  }
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
const findByCatagory = async (catagoryName) => {
  const itemModel = await getModel(modelName);
  console.log(`try to find items in ${catagoryName}`);
  let relevantItems = [];
  for (const key in itemModel) {
    if (itemModel[key].catagoryName === catagoryName) {
      relevantItems.push(itemModel[key]);
      break;
    }
  }
  if (!relevantItems) {
    console.log(`items in ${catagoryName} were not found`);
    return null;
  }
  console.log(`item in ${catagoryName} were found `);

  return relevantItems;
};
const addItem = async (data) => {
  console.log('adding item to db');
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
module.exports = {
  addItem, findByCatagory, findById, findByName, findAll
};
