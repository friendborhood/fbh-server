const {
  getDatabase, ref, update,
} = require('firebase/database');
require('./init');

const db = getDatabase();

module.exports = async (moduleName, data, id) => {
  update(
    ref(db, `${moduleName}/${id}`),
    data,
    { merge: true },
  );
};
