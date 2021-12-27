const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());
get(child(dbRef, 'users/omer')).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log('No data available');
  }
}).catch((error) => {
  console.error(error);
});
