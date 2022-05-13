/* eslint-disable import/no-import-module-exports */
/* eslint-disable consistent-return */
import { Router } from 'express';
import { extractUserNameFromAuth } from '../../../models/generic';
import logger from '../../../logger';
import {
  findByName, patchUser, validateUserLocationData,
} from '../../../models/user';

const router = Router();

router.get('/', async (req, res) => {
  logger.info('try get user');
  const userName = extractUserNameFromAuth(req);
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
    const userName = extractUserNameFromAuth(req);
    const { isAdmin } = data;
    if (isAdmin) {
      return res.status(400).json({
        error: `User name ${userName} tried to update isAdmin field. not allowed operation`,
      });
    }
    logger.info(`try patch user by name ${userName}`);
    const isExist = await findByName(userName);
    if (!isExist) {
      return res.status(400).json({ error: `User name ${userName} does not exist. cant patch.` });
    }
    const { location } = data;
    if (location) {
      try {
        await validateUserLocationData(location);
      } catch (e) {
        logger.error(e.message);
        return res.status(400).json({ error: e.message });
      }
    } else { // handles empty location
      delete data.location;
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
