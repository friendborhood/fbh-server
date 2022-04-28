const moment = require('moment-timezone');
const { uuid } = require('short-uuid');
const add = require('../../services/firebase-api/add');
const upsert = require('../../services/firebase-api/upsert');

const addTimeStamp = (data) => ({ ...data, lastUpdatedAt: `${moment.tz('Asia/Jerusalem')}` });
const addUuidEntity = async ({ data, modelName }) => {
  const generatedId = uuid();
  const timeStampedData = addTimeStamp(data);
  console.log(timeStampedData);
  await upsert(modelName, timeStampedData, generatedId);
  return generatedId;
};
const deleteEntity = async ({ modelName, id }) => {
  await add(modelName, null, id);
};
const patchEntity = async ({ data, modelName, entityId }) => {
  await upsert(modelName, data, entityId);
};
const formatKeyToJsonArray = (objectsArray, idKeyName = 'id') => objectsArray
  .map((object) => ({ ...object[1], [idKeyName]: object[0] }));

module.exports = {
  formatKeyToJsonArray,
  addUuidEntity,
  deleteEntity,
  patchEntity,
  addTimeStamp,
};
