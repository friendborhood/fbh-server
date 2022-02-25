const { transporter, mailOptions, getRandomCode } = require('./utils');

const sendAuthCodeToUserEmail = async (userEmail) => {
  const authCode = getRandomCode();
  const text = `Your auth code is ${authCode} 🐼 Happy friendborhooding!`;
  await transporter.sendMail({ ...mailOptions, to: userEmail, text });
  return authCode;
};
module.exports = { sendAuthCodeToUserEmail };
