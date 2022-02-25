const nodemailer = require('nodemailer');
require('dotenv').config();

const getRandomCode = () => Math.floor(1000 + Math.random() * 9000);

const EMAIL = process.env.AUTH_MAIL;
const PASS = process.env.AUTH_PASS;
const SERVICE = 'gmail';
const transporter = nodemailer.createTransport({
  service: SERVICE,
  auth: {
    user: EMAIL,
    pass: PASS,
  },
});

const mailOptions = {
  from: EMAIL,
  subject: 'Auth code to friendborhood',
};

module.exports = { transporter, mailOptions, getRandomCode };
