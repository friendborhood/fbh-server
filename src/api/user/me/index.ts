/* eslint-disable import/no-import-module-exports */
/* eslint-disable consistent-return */
import { Router } from 'express';
import logger from '../../../logger';
import {
  findByName, patchUser, validateUserLocationData,
} from '../../../models/user';

const router = Router();

router.get('/', async (req, res) => {
  logger.info('try get user');
  const { userName } = req.query;
  logger.info(`user name: ${userName}`);
  const user = await findByName(userName);
  if (!user) {
    return res.status(404).json({ error: `username ${userName} was not found.` });
  }
  return res.json(user);
});
router.patch('/', async (req, res) => {
  try {
    const data = req.body;
    const { email } = data;
    if (email) {
      return res.status(400).json({ error: 'email cannot be updated' });
    }
    const { userName } = req.query;
    logger.info(`try patch user by name ${userName}`);
    const isExist = await findByName(userName);
    if (!isExist) {
      return res.status(400).json({ error: `User name ${userName} does not exist. cant patch.` });
    }
    const { location } = data;
    if (location) {
      try {
        await validateUserLocationData(data);
      } catch (e) {
        logger.error(e.message);
        return res.status(400).json({ error: e.message });
      }
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
export default router;
