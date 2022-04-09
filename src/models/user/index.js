const Joi = require('joi');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');

const modelName = 'users';
const validateUserData = async (data) => {
  console.log('validating user data : ', data);
  const schema = Joi.object({
    userName: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    firstName: Joi.string()
      .required(),
    lastName: Joi.string()
      .required(),
    imageUrl: Joi.string().uri(),
  });
  await schema.validateAsync(data);
  console.log('user data okay');
};

const findByName = async (userName) => {
  console.log('getting model from db');
  const userModel = await getModel(modelName);
  const relevantUser = userModel[userName];
  if (!relevantUser) {
    console.log('user not found');
    return null;
  }
  return relevantUser;
};
const addUser = async (data, userName) => {
  console.log('adding user to db');
  await upsert(modelName, data, userName);
};
const patchUser = async (data, userName) => {
  console.log(`patching user ${userName}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, userName);
};
module.exports = {
  patchUser,
  findByName,
  addUser,
  validateUserData,
};
