require('dotenv').config();
const { initializeApp } = require('firebase/app');

const firebaseConfig = JSON.parse(process.env.FIRE_BASE_CONFIG);
const app = initializeApp(firebaseConfig);
module.exports = app;
