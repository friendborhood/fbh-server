/* eslint-disable consistent-return */
const { Router } = require('express');
const {
   addItem
} = require('../../models/item');

const router = Router();

router.get('/:itemId', async (req, res) => {
  console.log('try get item');
  const { itemId } = req.params;
  console.log(`item id: ${itemId}`);
  const item = await findById(itemId);
  if (!item) {
    return res.status(404).send(`Item with id ${itemId} was not found.`);
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
