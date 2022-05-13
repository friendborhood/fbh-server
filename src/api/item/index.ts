/* eslint-disable import/no-import-module-exports */
/* eslint-disable consistent-return */
import Router from 'express';
import { adminMiddleWare } from '../../auth';
import {
  findByCategory, findById,
  findByName,
  findAll,
  getAllCategories,
  validateItemData,
} from '../../models/item';

import {
  addUuidEntity,
  deleteEntity,
  patchEntity,
} from '../../models/generic';
import logger from '../../logger';

const ITEM_MODEL = 'items';

const router = Router();
router.use(adminMiddleWare);

router.get('/', async (req, res) => {
  logger.info('try get all items');
  const { categoryName } = req.query;
  const items = categoryName ? await findByCategory(categoryName) : await findAll();
  if (!items) {
    return res.status(204).json({ msg: 'Items were not found.' });
  }
  return res.json(items);
});
router.get('/:itemId', async (req, res) => {
  logger.info('try get item');
  const { itemId } = req.params;
  logger.info(`item id: ${itemId}`);
  const item = await findById(itemId);
  if (!item) {
    return res.status(404).json({ msg: `Item with id ${itemId} was not found.` });
  }
  return res.json(item);
});
router.get('/categories', async (req, res) => {
  const categories = await getAllCategories();
  logger.info(categories);
  return res.json({ categories });
});
router.post('/', async (req, res) => {
  try {
    const { isAdmin } = req.query;
    const { userName } = req.query;
    if (!isAdmin || isAdmin === 'false') {
      return res.status(400).json({ msg: `${userName} is non-admin user. Cannot add items to db` });
    }
    const data = req.body;
    try {
      await validateItemData(data);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    logger.info(`try add item by name ${data.itemName}`);
    const isExist = await findByName(data.itemName);
    if (isExist) {
      return res.status(400).json({ msg: `Item name ${data.itemName} already exists. item name must be unique` });
    }
    logger.info(`try add item with data ${JSON.stringify(data)}`);
    const newItemId = await addUuidEntity({ data, modelName: ITEM_MODEL });

    return res.json({
      msg: 'item was added to database successfully',
      itemId: newItemId,
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/:itemId', async (req, res) => {
  logger.info('try get item');
  const { itemId } = req.params;
  logger.info(`item id: ${itemId}`);
  const item = await findById(itemId);
  if (!item) {
    return res.status(404).json({ msg: `Item with id ${itemId} was not found.` });
  }
  await deleteEntity({ modelName: ITEM_MODEL, id: itemId });
  return res.status(200).json({ msg: `item with id:${itemId} was deleted` });
});

router.patch('/:itemId', async (req, res) => {
  try {
    logger.info('try get item');
    const { itemId } = req.params;
    logger.info(`item id: ${itemId}`);
    const { isAdmin } = req.query;
    const { userName } = req.query;
    if (!isAdmin || isAdmin === 'false') {
      return res.status(400).json({ msg: `${userName} is non-admin user. Cannot update items in db` });
    }
    const item = await findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: `Item with id ${itemId} was not found.` });
    }
    const data = req.body;
    await patchEntity({ data, modelName: ITEM_MODEL, entityId: itemId });
    return res.json({
      msg: 'item was updated in database successfully',
      itemId,
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
