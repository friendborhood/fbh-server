const { Router } = require('express');
const getUser = require('../../services/firebase-api/get');

const router = Router();

router.get('/:userId', async (req, res) => {
  console.log('try get user');
  const { userId } = req.params;
  console.log(`user id: ${userId}`);
  const user = await getUser(userId);
  if (!user) {
    res.status(404).send(`User with id ${userId} was not found.`);
    return;
  }
  res.json({
    data: user,
  });
});
module.exports = router;
