require('dotenv').config();
const { initializeApp } = require('firebase/app');

const FIRE_BASE_CONFIG = {
  apiKey: 'AIzaSyCegQ_467ySkRnCfsR_sDgpeb_2akjmTV0', authDomain: 'firendborhood.firebaseapp.com', databaseURL: 'https://firendborhood-default-rtdb.europe-west1.firebasedatabase.app', projectId: 'firendborhood', storageBucket: 'firendborhood.appspot.com', messagingSenderId: '354847400901', appId: '1:354847400901:web:d413ea1df4d2b28eb521ac',
};

const firebaseConfig = FIRE_BASE_CONFIG;
const app = initializeApp(firebaseConfig);
module.exports = app;
