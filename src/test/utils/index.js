const axios = require('axios');

const testNetwork = axios.create({ baseURL: 'http://localhost:3000' });
const USER_END_POINT = 'user';
const EXISTING_USER_ID = '21ada0dc-ca23-4002-881d-a60a006eb4f5';
const NON_EXISTING_USER_ID = '111';
const TEST_OFFERS_CATEGORY = 'TestCleaning';
const OFFERS_END_POINT = 'offers';
const TEST_USER = 'omergery1996';
const TEST_RADIUS = 3000000;
const COMPLEX_OBJECT = {
  placeholder: {
    placeholder2: {
      placeholder3: 'hey from logger',
    },
  },
};
module.exports = {
  TEST_RADIUS,
  TEST_USER,
  testNetwork,
  TEST_OFFERS_CATEGORY,
  USER_END_POINT,
  EXISTING_USER_ID,
  NON_EXISTING_USER_ID,
  COMPLEX_OBJECT,
  OFFERS_END_POINT,
};
