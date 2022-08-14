const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());

const getModel = async (modelName) => {
  const model = await get(child(dbRef, modelName));
  return model.val();
};

const getFromModelById = async (modelName, entityId) => {
  const model = await get(child(dbRef, `${modelName}/${entityId}`));
  return model.val();
};
module.exports = { getModel, getFromModelById };
