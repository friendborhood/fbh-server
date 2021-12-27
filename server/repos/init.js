const { getDatabase, ref, set } = require('firebase/database');

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCegQ_467ySkRnCfsR_sDgpeb_2akjmTV0',
  authDomain: 'firendborhood.firebaseapp.com',
  databaseURL: 'https://firendborhood-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'firendborhood',
  storageBucket: 'firendborhood.appspot.com',
  messagingSenderId: '354847400901',
  appId: '1:354847400901:web:d413ea1df4d2b28eb521ac',
};

const app = initializeApp(firebaseConfig);
module.exports = app;
