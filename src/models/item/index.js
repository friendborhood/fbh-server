const { uuid } = require('short-uuid');
const getModel = require('../../services/firebase-api/get');
const addData = require('../../services/firebase-api/upsert');

const modelName = 'items';

const findByName = async (userName) => {
  const userModel = await getModel(modelName);
  console.log(`try find user ${userName}`);
  let relevantUser = null;
  for (const key in userModel) {
    if (userModel[key].userName === userName) {
      relevantUser = userModel[key];
      break;
    }
  }
  if (!relevantUser) {
    console.log(`user ${userName} was not found`);
    return null;
  }
  console.log(`user ${userName} was  found `);

  return relevantUser;
};
const findById = async (index) => {
  console.log('getting model from db');
  const userModel = await getModel(modelName);
  const relevantUser = userModel[index];
  if (!relevantUser) {
    console.log('user not found');
    return null;
  }
  return relevantUser;
};
const addUser = async (data) => {
  console.log('adding user to db');
  const generatedId = uuid();
  await addData(modelName, data, generatedId);
  return generatedId;
};
module.exports = {
  findByName,
  findById,
  addUser,
};
