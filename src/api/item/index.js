/* eslint-disable consistent-return */
const { Router } = require('express');
const {
  addItem, findByCatagory, findById, findByName,
} = require('../../models/item');

const router = Router();

router.get('/', async (req, res) => {
  console.log('try get all items');
  const { itemId } = req.params;
  console.log(`item id: ${itemId}`);
  const item = await findById(itemId);
  if (!item) {
    return res.status(404).send(`Item with id ${itemId} was not found.`);
  }
  return res.json({
    data: item,
  });
});
router.get('/:itemId', async (req, res) => {
  console.log('try get item');
  const { itemId } = req.params;
  console.log(`item id: ${itemId}`);
  const item = await findById(itemId);
  if (!item) {
    return res.status(404).send(`Item with id ${itemId} was not found.`);
  }
  return res.json({
    data: item,
  });
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    //validateItemData(data); need to add this function
    console.log(`try add item by name ${data.itemName}`);
    //const isExist = await findByName(data.itemName);
    const isExist = false;
    if (isExist) {
      return res.status(400).send(`Item name ${data.itemName} already exists. item name must be unique`);
    }
    console.log(`try add item with data ${JSON.stringify(data)}`);
    const newItemId = await addItem(data);
    
    return res.json({
      msg: 'item was added to database successfully',
      itemId: newItemId,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});
module.exports = router;
