const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());

const getUser = async (userId) => {
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    console.log('No data available');
    return null;
  });
};
module.exports = getUser;
