const moment = require('moment-timezone');
const { uuid } = require('short-uuid');
const add = require('../../services/firebase-api/add');
const upsert = require('../../services/firebase-api/upsert');

const addTimeStamp = (data) => ({ ...data, lastUpdatedAt: `${moment.tz('Asia/Jerusalem').format()}` });
const addUuidEntity = async ({ data, modelName }) => {
  const generatedId = uuid();
  const timeStampedData = addTimeStamp(data);
  await upsert(modelName, timeStampedData, generatedId);
  return generatedId;
};
const deleteEntity = async ({ modelName, id }) => {
  await add(modelName, null, id);
};
const extractUserNameFromAuth = (req) => req.userName;
const extractIsAdminFromAuth = (req) => req.isAdmin;

const patchEntity = async ({ data, modelName, entityId }) => {
  const timeStampedData = addTimeStamp(data);
  await upsert(modelName, timeStampedData, entityId);
};
const formatKeyToJsonArray = (objectsArray, idKeyName = 'id') => objectsArray
  .map((object) => ({ ...object[1], [idKeyName]: object[0] }));

const parseJsonToArrayWithKeys = (json) => {
  const jsonAsArray = Object.entries(json);
  return formatKeyToJsonArray(jsonAsArray);
};

module.exports = {
  extractUserNameFromAuth,
  extractIsAdminFromAuth,
  parseJsonToArrayWithKeys,
  formatKeyToJsonArray,
  addUuidEntity,
  deleteEntity,
  patchEntity,
  addTimeStamp,
};
