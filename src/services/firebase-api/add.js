const { getDatabase, ref, set } = require('firebase/database');
require('./init');

const db = getDatabase();

module.exports = async (moduleName, data, id) => {
  set(
    ref(db, `${moduleName}/${id}`),
    data,
  );
};
