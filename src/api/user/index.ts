/* eslint-disable import/no-import-module-exports */
/* eslint-disable consistent-return */
import { Router } from 'express';
import { encodeToJwt, verifyGoogle, authMiddleware } from '../../auth';
import logger from '../../logger';
import me from './me';
import {
  findByName, addUser, validateUserData, extractPublicUserParams,
} from '../../models/user';
import { sendAuthCodeToUserEmail, sendMail } from '../../services/mail-service';
import CacheService from '../../services/redis';

const router = Router();
router.use('/me', authMiddleware, me);

router.get('/:userName', async (req, res) => {
  logger.info('try get user by name');
  const { userName } = req.params;
  logger.info(`user name: ${userName}`);
  const user = await findByName(userName);
  if (!user) {
    return res.status(404).json({ error: `username ${userName} was not found.` });
  }
  const publicUserParams = extractPublicUserParams(user);
  return res.json(publicUserParams);
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
router.post('/login', async (req, res) => {
  try {
    const { userName, googleAuth, code: userCodeInput } = req.body;
    const user = await findByName(userName);
    if (!user) {
      res.status(404).json({ error: `User name ${userName} was not found.` });
      return;
    }
    if (googleAuth) {
      const googleVerified = await verifyGoogle(googleAuth, userName);
      if (!googleVerified) {
        return res.status(403).json('error verifying with google auth');
      }
    } else {
      logger.info(`try validate user ${userName} entered correct pin code`);
      await CacheService.init();
      const correctCode = await CacheService.getKey(userName);
      logger.info(`user code ${userCodeInput} | correct code ${correctCode}`);
      if (correctCode !== userCodeInput) {
        logger.warn('wrong code');
        return res.status(400).json({
          error: 'user entered wrong pin code',
        });
      }
      CacheService.removeKey(userName);
      logger.info('correct code');
    }
    const token = encodeToJwt({ userName });

    return res.json({
      token,
      message: 'user entered correct code',
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
});
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    logger.info(`${JSON.stringify(data)}`);
    try {
      await validateUserData(data);
    } catch (e) {
      logger.error(e.message);
      return res.status(400).json({ error: e.message });
    }

    const { userName } = data;
    const { isAdmin } = data;
    if (isAdmin) {
      return res.status(400).json({ error: `User name ${userName} tried to update isAdmin field. not allowed operation` });
    }
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
      mailSubject: 'Welcome to Friendborhood!',
      content: `Hello ${userName},
      Friendborhood was aimed to make the neighborhood a better place and we glad you have chosen to take part :)
      Fill in your location and start looking at items around you.
      
      We wish you a very friendly experience,
      Friendborhood Team 🦊`,
      userEmail: data.email,
    });
    const token = encodeToJwt({ userName });
    return res.json({
      msg: 'user was added to database successfully',
      userName,
      token,
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});
export default router;
