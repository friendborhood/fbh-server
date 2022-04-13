/* eslint-disable consistent-return */
const { Router } = require('express');
const {
  findByName, addUser, validateUserData, patchUser,
} = require('../../models/user');
const { sendAuthCodeToUserEmail, sendMail } = require('../../services/mail-service');
const CacheService = require('../../services/redis');

const router = Router();

router.get('/:userName', async (req, res) => {
  console.log('try get user');
  const { userName } = req.params;
  console.log(`user name: ${userName}`);
  const user = await findByName(userName);
  if (!user) {
    return res.status(404).send(`username ${userName} was not found.`);
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
    console.log(`user email was sent to ${userName}`);
    await CacheService.init();
    await CacheService.setKey(userName, authCode);
    console.log(`redis set ${userName} to ${authCode}`);
    res.json({
      message: 'OK',
    });
  } catch (e) {
    console.error(e);
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
router.patch('/:userName', async (req, res) => {
  try {
    const data = req.body;
    const { userName } = req.params;
    console.log(`try patch user by name ${userName}`);
    const isExist = await findByName(userName);
    if (!isExist) {
      return res.status(400).send(`User name ${userName} does not exists. cant patch.`);
    }
    await patchUser(data, userName);

    return res.json({
      msg: `user ${userName} was patched successfully`,

    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    try {
      await validateUserData(data);
    } catch (e) {
      console.log(e.message);
      return res.status(400).json({ error: e.message });
    }
    const { userName } = data;
    console.log(`try add user by name ${userName}`);
    const isExist = await findByName(userName);
    if (isExist) {
      return res.status(400).send(`User name ${userName} already exists. user name must be unique`);
    }
    data.registerDate = new Date();
    console.log(`try add user with data ${JSON.stringify(data)}`);
    delete data.userName;
    await addUser(data, userName);

    await sendMail({
      mailSubject: 'Welcome to friendborhood!',
      content: `Hello ${userName}`,
      userEmail: data.email,
    });
    return res.json({
      msg: 'user was added to database successfully',
      userName,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});
module.exports = router;
