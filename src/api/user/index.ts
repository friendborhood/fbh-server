/* eslint-disable import/no-import-module-exports */
/* eslint-disable consistent-return */
import { Router } from 'express';
import { encodeToJwt, validateApiKey } from '../../auth';
import logger from '../../logger';
import {
  findByName, addUser, validateUserData, patchUser,
} from '../../models/user';
import { sendAuthCodeToUserEmail, sendMail } from '../../services/mail-service';
import CacheService from '../../services/redis';

const router = Router();

router.get('/:userName', async (req, res) => {
  logger.info('try get user');
  const { userName } = req.params;
  logger.info(`user name: ${userName}`);
  const user = await findByName(userName);
  if (!user) {
    return res.status(404).json({ error: `username ${userName} was not found.` });
  }
  return res.json(user);
});
router.post('/login/:userName', async (req, res) => {
  const { userName } = req.params;
  const { apiKey } = req.body;
  const isVerifiedToLogIn = validateApiKey(apiKey);
  if (!isVerifiedToLogIn) {
    return res.status(403).json('your api key is not verified for log in or no api key was provided.');
  }
  const userExists = await findByName(userName);
  if (!userExists) {
    res.status(404).json({ error: `User name ${userName} was not found.` });
    return;
  }
  logger.info(`try login user by name ${userName}`);
  try {
    const token = encodeToJwt({ userName });
    return res.json({
      message: 'success login',
      token,
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      error: e,
    });
  }
});
router.post('/auth/:userName', async (req, res) => {
  const { userName } = req.params;
  logger.info(`try get user by name ${userName}`);
  try {
    const user = await findByName(userName);
    if (!user) {
      res.status(404).json({ error: `User name ${userName} was not found.` });
      return;
    }
    const { email } = user;
    const authCode = await sendAuthCodeToUserEmail(email);
    logger.info(`user email was sent to ${userName}`);
    await CacheService.init();
    await CacheService.setKey(userName, authCode);
    logger.info(`redis set ${userName} to ${authCode}`);
    res.json({
      message: 'OK',
    });
  } catch (e) {
    logger.error(e);
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
      res.status(404).json({ error: `User name ${userName} was not found.` });
      return;
    }
    const { code: userCodeInput } = req.query;
    logger.info(`try validate user ${userName} entered correct pin code`);
    await CacheService.init();
    const correctCode = await CacheService.getKey(userName);
    logger.info(`user code ${userCodeInput} correct code ${correctCode}`);
    if (correctCode !== userCodeInput) {
      logger.warn('wrong code');
      return res.status(400).json({
        error: 'user entered wrong pin code',
      });
    }
    logger.info('correct code');
    const token = encodeToJwt({ userName });
    // no need to await here
    CacheService.removeKey(userName);

    return res.json({
      token,
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
    logger.info(`try patch user by name ${userName}`);
    const isExist = await findByName(userName);
    if (!isExist) {
      return res.status(400).json({ error: `User name ${userName} does not exists. cant patch.` });
    }
    await patchUser(data, userName);

    return res.json({
      msg: `user ${userName} was patched successfully`,

    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    logger.info(data);
    try {
      await validateUserData(data);
    } catch (e) {
      logger.error(e.message);
      return res.status(400).json({ error: e.message });
    }
    const { userName } = data;
    logger.info(`try add user by name ${userName}`);
    const isExist = await findByName(userName);
    if (isExist) {
      return res.status(400).json({ error: `User name ${userName} already exists. user name must be unique` });
    }
    data.registerDate = new Date();
    logger.info(`try add user with data ${JSON.stringify(data)}`);
    delete data.userName;
    await addUser(data, userName);

    sendMail({
      mailSubject: 'Welcome to friendborhood!',
      content: `Hello ${userName}`,
      userEmail: data.email,
    });
    return res.json({
      msg: 'user was added to database successfully',
      userName,
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});
module.exports = router;
