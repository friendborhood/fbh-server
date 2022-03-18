const { Router } = require('express');
const { findById, findByName, addUser } = require('../../models/user');
const { sendAuthCodeToUserEmail } = require('../../services/node-mail-auth');

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

router.post('/', async (req, res) => {
  // const { email, firstName, lastName, location, rating} = req.body;
  const data = req.body;
  console.log(`try add user by name ${data.userName}`);
  const isExist = await findByName(data.userName);
  if (isExist) {
    return res.status(400).send(`User name ${data.userName} already exists. must be unique`);
  }
  const newUserId = await addUser(data);
  return res.json({
    msg: 'user was added to database',
    newUserId,
  });
});
module.exports = router;
