const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());
const getUser = (id) => {
  get(child(dbRef, `users/${id}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    console.log('No data available');
  });
  


module.exports = getUser;
