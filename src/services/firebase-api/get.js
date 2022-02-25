const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());

const getModel = async (modelName) => {
  const model = await get(child(dbRef, modelName));
  return model.val();
};
module.exports = getModel;
