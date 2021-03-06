/* eslint-disable consistent-return */
const { Router } = require('express');
const { adminMiddleWare } = require('../../auth');
const {
  findByCategory,
  findByOfferId,
  findAll,
  validateOfferData,
  getOffersInArea,
  sortOffersByDistance,
} = require('../../models/offer');
const {
  addUuidEntity,
  deleteEntity,
  patchEntity,
  extractUserNameFromAuth,
} = require('../../models/generic');
const logger = require('../../logger');
const { findByName } = require('../../models/user');

const OFFER_MODEL = 'offers';
const router = Router();

router.get('/', adminMiddleWare, async (req, res) => {
  logger.info('try get all offers');
  const { categoryName } = req.query;
  const offers = categoryName ? await findByCategory(categoryName) : await findAll();
  if (offers.length === 0) {
    return res.status(204).json({ msg: 'No Offered Items were found.' });
  }
  return res.json(offers);
});

router.get('/in-area', async (req, res) => {
  try {
    const userName = extractUserNameFromAuth(req);
    const { categoryName = null, radius } = req.query;
    if (!userName) {
      return res.status(400).json({ msg: 'must provide userName' });
    }
    if (!radius) {
      return res.status(400).json({ msg: 'must provide radius' });
    }
    logger.info('try get offers in area', { userName, radius, categoryName });
    const user = await findByName(userName);
    if (!user) {
      logger.error('user was not found. cant find offers', userName);
      return res.status(404).json({ msg: `User ${userName} not found` });
    }
    const { location } = user;
    if (!location) {
      logger.error('user location is unknown, cant get offers in area ', userName);
      return res.status(400).json({ msg: `User ${userName} not found` });
    }
    const { geoCode: userLocation } = location;
    const offersInArea = await getOffersInArea(
      { targetLocation: userLocation, radius, categoryName },
    );
    if (offersInArea.length === 0) {
      return res.status(204).json({ msg: 'No relevant offers were found.' });
    }
    const sortedOffers = sortOffersByDistance(
      { offers: offersInArea, targetLocation: userLocation },
    );
    return res.json(sortedOffers);
  } catch (e) {
    logger.error('got 500 offers in area', e);
    return res.status(500).json({ error: e.message });
  }
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
    const newOfferId = await addUuidEntity({
      data: {
        ...data,
        offererUserName: extractUserNameFromAuth(req),
      },
      modelName: OFFER_MODEL,
    });

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
  await deleteEntity({ modelName: OFFER_MODEL, id: offerId });
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
    await patchEntity({ data, modelName: OFFER_MODEL, entityId: offerId });
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
