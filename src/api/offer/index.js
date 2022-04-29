/* eslint-disable consistent-return */
const { Router } = require('express');
const {
  findByCategory,
  findByOfferId,
  findAll,
  validateOfferData,
} = require('../../models/offer');
const {
  addUuidEntity,
  deleteEntity,
  patchEntity,
} = require('../../models/generic');
const logger = require('../../logger');

const OFFER_MODEL = 'offers';
const router = Router();

router.get('/', async (req, res) => {
  logger.info('try get all offers');
  const { categoryName } = req.query;
  const offers = categoryName ? await findByCategory(categoryName) : await findAll();
  if (!offers) {
    return res.status(404).json({ msg: 'No Offered Items were  found.' });
  }
  return res.json(offers);
});
router.get('/:offerId', async (req, res) => {
  logger.info('try get offer');
  const { offerId } = req.params;
  logger.info(`offer id: ${offerId}`);
  const offer = await findByOfferId(offerId);
  if (!offer) {
    return res.status(404).json({ msg: `Offer with id ${offerId} was not found.` });
  }
  return res.json(offer);
});
router.post('/', async (req, res) => {
  logger.info('started offer post request');
  try {
    const data = req.body;
    try {
      await validateOfferData(data);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    logger.info(`try add offer with data ${JSON.stringify(data)}`);
    const newOfferId = await addUuidEntity({ data, modelName: OFFER_MODEL });

    return res.json({
      msg: 'offer was added to database successfully',
      offerId: newOfferId,
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/:offerId', async (req, res) => {
  logger.info('try get offer');
  const { offerId } = req.params;
  logger.info(`offer id: ${offerId}`);
  const offer = await findByOfferId(offerId);
  if (!offer) {
    return res.status(404).json({ msg: `Offer with id ${offerId} was not found.` });
  }
  await deleteEntity({ model: OFFER_MODEL, id: offerId });
  return res.status(200).json({ msg: `Offer with id:${offerId} was deleted` });
});

router.patch('/:offerId', async (req, res) => {
  try {
    logger.info('try get offer');
    const { offerId } = req.params;
    logger.info(`Offer id: ${offerId}`);
    const offer = await findByOfferId(offerId);
    if (!offer) {
      return res.status(404).json({ msg: `Offer with id ${offerId} was not found.` });
    }
    const data = req.body;
    await patchEntity({ data, model: OFFER_MODEL, entityId: offerId });
    return res.json({
      msg: 'offer was updated in database successfully',
      offerId,
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
