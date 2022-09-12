/* eslint-disable consistent-return */
const { Router } = require('express');
const { adminMiddleWare } = require('../../auth');
const {
  findByCategory,
  findByOfferId,
  findAll,
  validateOfferData,
  getOffersInArea,
  getSelfOffers,
  sortOffersByDistance,
  sortOffersByDate,
  filterRelevantOffersByDistance,
  filterEnabledOffers,
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
    return res.status(200).json({ msg: 'No Offered Items were found.' });
  }
  return res.json(offers);
});

router.get('/in-area', async (req, res) => {
  try {
    const userName = extractUserNameFromAuth(req);
    const {
      categories = [], radius, newest = null, filterSelf = null,
    } = req.query;
    if (!userName) {
      return res.status(400).json({ msg: 'must provide userName' });
    }
    if (!radius) {
      return res.status(400).json({ msg: 'must provide radius' });
    }
    logger.info('try get offers in area', { userName, radius, categories });
    const user = await findByName(userName);
    if (!user) {
      logger.error('user was not found. cant find offers', userName);
      return res.status(404).json({ msg: `User ${userName} not found` });
    }
    const { location } = user;
    if (!location) {
      logger.error('user location is unknown, cant get offers in area ', userName);
      return res.status(406).json({ msg: 'Fill in your address under \'Your Info\' section to start watching items around you' });
    }
    const { geoCode: userLocation } = location;
    const offersInArea = await getOffersInArea(
      { targetLocation: userLocation, radius, categories },
    );
    const noOffersInArea = !offersInArea || (offersInArea && offersInArea.length === 0);
    if (noOffersInArea) {
      return res.status(200).json([]);
    }

    const relevantOffers = filterRelevantOffersByDistance({
      offers: offersInArea,
      targetLocation: userLocation,
    });
    const sortedOffers = newest ? sortOffersByDate({ offers: relevantOffers })
      : sortOffersByDistance({ offers: relevantOffers });
    const activeSortedOffers = filterEnabledOffers({ offers: sortedOffers });
    if (filterSelf) {
      logger.info(`${userName}'s offers were filtered out`);
      return res.json(activeSortedOffers.filter((offer) => (
        offer.offererUserName !== userName)));
    }
    return res.json(activeSortedOffers);
  } catch (e) {
    logger.error('got error by offers in area', e);
    return res.status(500).json({ error: e.message });
  }
});
router.get('/me', async (req, res) => {
  try {
    const userName = extractUserNameFromAuth(req);
    if (!userName) {
      return res.status(400).json({ msg: 'must provide userName' });
    }
    logger.info(`try get the offers of ${userName}`);
    const user = await findByName(userName);
    if (!user) {
      logger.error('user was not found. cant find offers', userName);
      return res.status(404).json({ msg: `User ${userName} not found` });
    }
    const selfOffers = await getSelfOffers({ userName });
    if (selfOffers.length === 0) {
      return res.status(200).json([]);
    }

    const sortedOffers = sortOffersByDate({ offers: selfOffers });
    return res.json(sortedOffers);
  } catch (e) {
    logger.error('got error by self offers', e);
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
