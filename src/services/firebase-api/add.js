const { getDatabase, ref, set } = require('firebase/database');
require('./init');

const db = getDatabase();

module.exports = async (userId, name) => {
  set(ref(db, `users/${userId}`), {
    username: name,
    phone: '054',
  });
};
