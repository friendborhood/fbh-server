require('dotenv').config();
const { initializeApp } = require('firebase/app');

console.log(process.env.FIRE_BASE);
const FIRE_BASE_CONFIG = process.env.FIRE_BASE;
console.log(FIRE_BASE_CONFIG);
const firebaseConfig = FIRE_BASE_CONFIG;
const app = initializeApp(firebaseConfig);
module.exports = app;
