/* eslint-disable consistent-return */
const { Router } = require('express');
const {
  findById, findByName, addUser, validateUserData,
} = require('../../models/user');
const { sendAuthCodeToUserEmail, sendMail } = require('../../services/mail-service');
const CacheService = require('../../services/redis');

const router = Router();

router.get('/:userId', async (req, res) => {
  console.log('try get user');
  const { userId } = req.params;
  console.log(`user id: ${userId}`);
  const user = await findById(userId);
  if (!user) {
    return res.status(404).send(`User with id ${userId} was not found.`);
  }
  return res.json({
    data: user,
  });
});

router.post('/auth/:userName', async (req, res) => {
  const { userName } = req.params;
  console.log(`try get user by name ${userName}`);
  try {
    const user = await findByName(userName);
    if (!user) {
      res.status(404).send(`User name ${userName} was not found.`);
      return;
    }
    const { email } = user;
    const authCode = await sendAuthCodeToUserEmail(email);
    await CacheService.init();
    await CacheService.setKey(userName, authCode);
    res.json({
      message: 'OK',
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
});
router.get('/auth/validate/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await findByName(userName);
    if (!user) {
      res.status(404).send(`User name ${userName} was not found.`);
      return;
    }
    const { code: userCodeInput } = req.query;
    console.log(`try validate user ${userName} entered correct pin code`);
    await CacheService.init();
    const correctCode = await CacheService.getKey(userName);
    console.log(`user code ${userCodeInput} correct code ${correctCode}`);
    if (correctCode !== userCodeInput) {
      console.log('wrong code');
      return res.status(400).json({
        error: 'user entered wrong pin code',
      });
    }
    console.log('correct code');
    return res.json({
      message: 'user entered correct code',
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    validateUserData(data);
    console.log(`try add user by name ${data.userName}`);
    const isExist = await findByName(data.userName);
    if (isExist) {
      return res.status(400).send(`User name ${data.userName} already exists. user name must be unique`);
    }
    data.registerDate = new Date();
    console.log(`try add user with data ${JSON.stringify(data)}`);
    const newUserId = await addUser(data);

    await sendMail({
      mailSubject: 'Welcome to friendborhood!',
      content: `Hello ${data.userName}`,
      userEmail: data.email,
    });
    return res.json({
      msg: 'user was added to database successfully',
      userId: newUserId,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});
module.exports = router;
