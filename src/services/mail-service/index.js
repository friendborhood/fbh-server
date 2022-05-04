const logger = require('../../logger');
const {
  transporter, mailOptions, getRandomCode, FBH_EMAIL,
} = require('./utils');

const sendAuthCodeToUserEmail = async (userEmail) => {
  const authCode = getRandomCode();
  const text = `Your auth code is ${authCode} 🐼 Happy friendborhooding!`;
  await transporter.sendMail({ ...mailOptions, to: userEmail, text });
  return authCode;
};
const sendMail = async ({ mailSubject, content, userEmail }) => {
  try {
    await transporter.sendMail({
      from: FBH_EMAIL, subject: mailSubject, to: userEmail, text: content,
    });
  } catch (e) {
    logger.error('mail error', e);
  }
};

module.exports = { sendAuthCodeToUserEmail, sendMail };
