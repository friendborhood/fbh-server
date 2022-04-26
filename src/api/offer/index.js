/* eslint-disable consistent-return */
const { Router } = require('express');
const {
  addItem,
  findByCategory,
  findByOfferId,
  findAll,
  validateOfferData,
  deleteItem,
  patchItem,
} = require('../../models/offer');

const router = Router();

router.get('/', async (req, res) => {
  console.log('try get all offered items');
  const { categoryName } = req.query;
  const offers = categoryName ? await findByCategory(categoryName) : await findAll();
  if (!offers) {
    return res.status(404).json({ msg: 'No Offered Items were  found.' });
  }
  return res.json(offers);
});
router.get('/:offerId', async (req, res) => {
  console.log('try get offer');
  const { offerId } = req.params;
  console.log(`item id: ${offerId}`);
  const offer = await findByOfferId(offerId);
  if (!offer) {
    return res.status(404).json({ msg: `Offer of item with id ${offerId} was not found.` });
  }
  return res.json(offer);
});
router.post('/', async (req, res) => {
  console.log('started offer post request');
  try {
    const data = req.body;
    try {
      await validateOfferData(data);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    console.log(`try add offer with data ${JSON.stringify(data)}`);
    const newOfferId = await addItem(data);

    return res.json({
      msg: 'item was added to database successfully',
      offerId: newOfferId,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/:offerId', async (req, res) => {
  console.log('try get offer');
  const { offerId } = req.params;
  console.log(`item id: ${offerId}`);
  const offer = await findByOfferId(offerId);
  if (!offer) {
    return res.status(404).json({ msg: `Offer with id ${offerId} was not found.` });
  }
  await deleteItem(offerId);
  return res.status(200).json({ msg: `Offer with id:${offerId} was deleted` });
});

router.patch('/:offerId', async (req, res) => {
  try {
    console.log('try get item');
    const { offerId } = req.params;
    console.log(`Offer id: ${offerId}`);
    const offer = await findByOfferId(offerId);
    if (!offer) {
      return res.status(404).json({ msg: `Item with id ${offerId} was not found.` });
    }
    const data = req.body;
    await patchItem(data, offerId);
    return res.json({
      msg: 'item was updated in database successfully',
      offerId,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
