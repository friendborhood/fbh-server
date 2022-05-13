import { Router } from 'express';
import logger from '../../logger';
import { getAllCategories } from '../../models/item';

const router = Router();
router.get('/', async (req, res) => {
  try {
    logger.info('try to return categories');
    const categories = await getAllCategories();
    return res.json(categories);
  } catch (e) {
    logger.error('error getting categories');
    return res.status(400).json({
      error: e.message,
    });
  }
});
export default router;
