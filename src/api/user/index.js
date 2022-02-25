const { Router } = require('express');
const { findByIndex, findByName } = require('../../models/user');
const { sendAuthCodeToUserEmail } = require('../../services/node-mail-auth');

const router = Router();

router.get('/:userId', async (req, res) => {
  console.log('try get user');
  const { userId } = req.params;
  console.log(`user id: ${userId}`);
  const user = await findByIndex(userId);
  if (!user) {
    res.status(404).send(`User with id ${userId} was not found.`);
    return;
  }
  res.json({
    data: user,
  });
});

router.post('/auth/:userName', async (req, res) => {
  const { userName } = req.params;
  console.log(`try get user by name ${userName}`);
  const user = await findByName(userName);
  if (!user) {
    res.status(404).send(`User name ${userName} was not found.`);
    return;
  }
  const { email } = user;
  const authCode = await sendAuthCodeToUserEmail(email);
  console.log(authCode);
  res.json({
    authCode,
  });
});
module.exports = router;
