const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());

module.exports = async (userId) => {
  const user = await get(child(dbRef, `users/${userId}`));
  if (user.exists()) {
    return user.val();
  }
  console.log(`User with id :${userId} not found`);
  return null;
};
