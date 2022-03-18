const axios = require('axios');

const testNetwork = axios.create({ baseURL: 'http://localhost:3000' });
const USER_END_POINT = 'user';
const EXISTING_USER_ID = '21ada0dc-ca23-4002-881d-a60a006eb4f5';
const NON_EXISTING_USER_ID = '111';
module.exports = {
  testNetwork,
  USER_END_POINT,
  EXISTING_USER_ID,
  NON_EXISTING_USER_ID,
};
