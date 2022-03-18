const getModel = require('../../services/firebase-api/get');
const addData = require('../../services/firebase-api/add');

const modelName = 'users';
const findByName = async (userName) => {
  const userModel = await getModel(modelName);
  console.log('try find user');
  console.log(userModel);
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
const addUser = async (data) => {
  console.log('adding user to db');
  await addData(modelName, data);

};
module.exports = { findByName, findByIndex, addUser };
