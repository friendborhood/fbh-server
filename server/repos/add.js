const { getDatabase, ref, set } = require('firebase/database');
require('./init');

const database = getDatabase();
console.log(database);

const writeUserData = (userId, name) => {
  const db = getDatabase();
  set(ref(db, `users/${userId}`), {
    username: name,
  });
};
writeUserData(4, 'omer GA');
