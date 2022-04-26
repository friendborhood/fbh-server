const { uuid } = require('short-uuid');
const add = require('../../services/firebase-api/add');
const upsert = require('../../services/firebase-api/upsert');

const addUuidEntity = async ({ data, modelName }) => {
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
const deleteEntity = async ({ modelName, index }) => {
  await add(modelName, null, index);
};
const patchEntity = async ({ data, modelName, entityId }) => {
  await upsert(modelName, data, entityId);
};

module.exports = {
  addUuidEntity,
  deleteEntity,
  patchEntity,
};
