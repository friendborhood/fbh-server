import axios from 'axios';

const { TEST_TOKEN } = process.env;
export const testNetwork = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    Authorization: TEST_TOKEN,
  },
});

export const USER_END_POINT = 'user';
export const ME_END_POINT = 'me';
export const EXISTING_USER_ID = '21ada0dc-ca23-4002-881d-a60a006eb4f5';
export const NON_EXISTING_USER_ID = '111';
export const TEST_OFFERS_CATEGORY = 'TestCleaning';
export const OFFERS_END_POINT = 'offers';

export const TEST_USER = 'omergery1996';
export const TEST_RADIUS = 3000000;
export const COMPLEX_OBJECT = {
  placeholder: {
    placeholder2: {
      placeholder3: 'hey from logger',
    },
  },
};
export const mockDataOffersInArea = [

  {
    name: 'Auckland',
    location: {
      geoCode: {
        lat: -36.23905226945528, lng: 174.6325671519025,
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
    name: 'Taizu',
    location: {
      geoCode: {
        lat: 32.063823740125144, lng: 34.77991637605572,
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
    name: 'Pizza Lila',
    location: {
      geoCode: {
        lat: 32.060350442324626, lng: 34.77184829173633,
      },
    },

  },

];
export const mockTargetLocation = {
  name: 'Dalida',
  lat: 32.06005947945416,
  lng: 34.77300700597368,

};
export const mockRadius = 25000;
