const { getDatabase, ref, set } = require('firebase/database');
require('./init');

const db = getDatabase();

module.exports = async (moduleName, data) => {
  set(ref(db, `${moduleName}/a`), 
    data
);
};
