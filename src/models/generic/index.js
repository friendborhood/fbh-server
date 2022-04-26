const { uuid } = require('short-uuid');
const add = require('../../services/firebase-api/add');
const upsert = require('../../services/firebase-api/upsert');

const addEntity = async ({ data, modelName }) => {
  const generatedId = uuid();
  await upsert(modelName, data, generatedId);
  return generatedId;
};
const deleteEntity = async ({ data, modelName }) => {
  await add(modelName, null, index);
};
const patchEntity = async ({ data, modelName }) => {
  await upsert(modelName, data, entityId);
};

module.exports = {
  addEntity,
  deleteEntity,
  patchEntity,
};
