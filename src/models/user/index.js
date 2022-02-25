const getModel = require('../../services/firebase-api/get');

const modelName = 'users';
const findByName = async (userName) => {
  const userModel = await getModel(modelName);
  console.log('try find user');
  const relevantUser = userModel.find((user) => {
    if (user) {
      return user.userName === userName;
    }
    return false;
  });
  if (!relevantUser) {
    console.log('user not found');
    return null;
  }
  return relevantUser;
};
const findByIndex = async (index) => {
  console.log('getting model from db');
  const userModel = await getModel(modelName);
  const relevantUser = userModel[index];
  if (!relevantUser) {
    console.log('user not found');
    return null;
  }
  return relevantUser;
};
module.exports = { findByName, findByIndex };
