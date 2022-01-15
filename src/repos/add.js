const { getDatabase, ref, set } = require('firebase/database');
require('./init');

const database = getDatabase();
console.log(database);

const writeUserData = (userId, name) => {
  const db = getDatabase();
  set(ref(db, `users/${userId}`), {
    username: name,
    phone: '054',
  });
};
writeUserData(5, 'Omer Arzi');
