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
    name: 'Taizu',
    location: {
      geoCode: {
        lat: 32.063823740125144, lng: 34.77991637605572,
      },
    },
  },
  {
    name: 'Safari RamatGan',
    location: {
      geoCode: {
        lat: 32.051639340346966, lng: 34.769788355219255,
      },
    },
  },
  {
    name: 'Auckland',
    location: {
      geoCode: {
        lat: -36.23905226945528, lng: 174.6325671519025,
      },
    },
  },
  {
    name: 'Haifa',
    location: {
      geoCode: {
        lat: 32.79471141572239, lng: 34.988451356599754,
      },
    },
  },

  {
    name: 'Modiin',
    location: {
      geoCode: {
        lat: -36.23905226945528, lng: 174.6325671519025,
      },
    },
  },
  {
    name: 'Pizza Lila',
    location: {
      geoCode: {
        lat: 32.060350442324626, lng: 34.77184829173633,
      },
    },

  },

];
const mockTargetLocation = {
  name: 'Dalida',
  lat: 32.06005947945416,
  lng: 34.77300700597368,

};
const mockRadius = 25000;
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
