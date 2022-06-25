import Joi from 'joi';
import logger from '../../logger';
import getModel from '../../services/firebase-api/get';
import upsert from '../../services/firebase-api/upsert';

const modelName = 'users';
export const validateUserData = async (data) => {
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

export const extractPublicUserParams = (userData) => {
  const publicParams = userData;
  delete publicParams.favoriteCategory;
  delete publicParams.isAdmin;
  delete publicParams.registerDate;
  delete publicParams.email;
  delete publicParams.searchRadius;
  delete publicParams.location;
  return publicParams;
};
export const validateUserLocationData = async (data) => {
  const schema = Joi.object({
    address: Joi.string().required(),
    geoCode: {
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    },
  });
  await schema.validateAsync(data);
  logger.info('user location is okay');
};

export const findByName = async (userName) => {
  logger.info('getting model from db');
  const userModel = await getModel(modelName);
  const relevantUser = userModel[userName];
  if (!relevantUser) {
    logger.warn('user not found');
    return null;
  }
  return relevantUser;
};
export const addUser = async (data, userName) => {
  logger.info('adding user to db');
  await upsert(modelName, { ...data }, userName);
};
export const patchUser = async (data, userName) => {
  logger.info(`patching user ${userName}, modifing data ${JSON.stringify(data)}`);
  await upsert(modelName, data, userName);
};
