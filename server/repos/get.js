const {
  getDatabase, ref, child, get,
} = require('firebase/database');
require('./init');

const dbRef = ref(getDatabase());
const getData = async (key) => {
  const data = await get(child(dbRef, `users/${key}`));
  console.log(data.val());
  if (data.exists()) {
    return data;
  }

  return null;
};
module.exports = getData;
