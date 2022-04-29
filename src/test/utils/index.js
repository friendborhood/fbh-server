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
const mockDataOffersInArea = [
  {
    name: '4',
    location: {
      geoCode: {
        lat: 31.27566902435525, lng: 34.75106102314429,
      },
    },
  },
  {
    name: '1',
    location: {
      geoCode: {
        lat: 32.1716207368198, lng: 34.847595734248976,
      },
    },
  },
  {
    name: '3',
    location: {
      geoCode: {
        lat: 38.68283263477214, lng: -9.063595043382376,
      },
    },
  },
  {
    name: '8',
    location: {
      geoCode: {
        lat: 28.19485862635811, lng: 18.348766841649137,
      },
    },
  },
  {
    name: '5',
    location: {
      geoCode: {
        lat: 31.768282467383457, lng: 35.178790083757946,
      },
    },
  },
  {
    name: '6',
    location: {
      geoCode: {
        lat: 31.903431003993127, lng: 34.98240458871311,
      },
    },
  },
  {
    name: '1',
    location: {
      geoCode: {
        lat: 32.06969216175387, lng: 34.77153511285643,
      },
    },

  },

];
const mockTargetLocation = {
  lat: 32.06969216175387, lng: 34.77153511285643,
};
const mockRadius = 250000;
module.exports = {
  mockRadius,
  mockDataOffersInArea,
  mockTargetLocation,
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
