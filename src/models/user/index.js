const Joi = require('joi');
const logger = require('../../logger');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');

const DEFAULT_SEARCH_RADIUS = 3;
const modelName = 'users';
const validateUserData = async (data) => {
  logger.info('validating user data : ', data);
  const schema = Joi.object({
    userName: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io', 'il'] } })
      .required(),
    firstName: Joi.string()
      .required(),
    lastName: Joi.string()
      .required(),
    imageUrl: Joi.string().uri(),
  });
  await schema.validateAsync(data);
  logger.info('user data okay');
};

const findByName = async (userName) => {
  logger.info('getting model from db');
  const userModel = await getModel(modelName);
  const relevantUser = userModel[userName];
  if (!relevantUser) {
    logger.info('user not found');
    return null;
  }
  return relevantUser;
};
const addUser = async (data, userName) => {
  logger.info('adding user to db');
  await upsert(modelName, { ...data, searchRadius: DEFAULT_SEARCH_RADIUS }, userName);
};
const patchUser = async (data, userName) => {
  logger.info(`patching user ${userName}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, userName);
};
module.exports = {
  patchUser,
  findByName,
  addUser,
  validateUserData,
};
