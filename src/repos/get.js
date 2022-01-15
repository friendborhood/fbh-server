const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());

const getUser = async (userId) => {
  const user = await get(child(dbRef, `users/${userId}`));
  if (user.exists()) {
    return user.val();
  }
  console.log('No data available');
  return null;
};

module.exports = getUser;
