import '../api';
import logger from '../logger';
import {
  validateOfferData, filterOffersByArea, sortOffersByDistance, filterRelevantOffersByDistance,
} from '../models/offer';
import {
  USER_END_POINT,
  testNetwork,
  COMPLEX_OBJECT,
  TEST_OFFERS_CATEGORY,
  OFFERS_END_POINT,
  TEST_RADIUS,
  mockTargetLocation,
  mockDataOffersInArea,
  mockRadius,
} from './utils';

require('dotenv').config();

jest.setTimeout(1000 * 10);
describe('Basic sanity server CRUD tests', () => {
  it('Can get user', async () => {
    const { data, status } = await testNetwork.get(`${USER_END_POINT}/me`);
    expect(data).toBeDefined();
    expect(status).toBe(200);
  });
  it('Logger test', () => {
    logger.info('i am an info', COMPLEX_OBJECT);
    logger.warn('i am a warning ', { warning: 'warn' });
    logger.error(' i am an error', { someError: ['error1', 'error2'] });
  });
  it('Can get categories for non admin user', async () => {
    const categories = await testNetwork.get('categories');
    expect(categories).toBeDefined();
  });
  xit('Offers in area - E2E', async () => {
    const { data: offers } = await testNetwork.get(`${OFFERS_END_POINT}/in-area`, {
      params: {
        categories: [TEST_OFFERS_CATEGORY],
        radius: TEST_RADIUS,
      },
    });
    await Promise.all(offers.map((offer) => validateOfferData(offer)));
    expect(offers[0].distanceFromUser).toBeLessThanOrEqual(offers[1].distanceFromUser);
    expect(offers.length).toBeGreaterThanOrEqual(4);
  });
  it('Offers in area - Mock', () => {
    const relevantOffers = filterOffersByArea(
      {
        offers: mockDataOffersInArea,
        radiusInMeters: mockRadius,
        targetLocation: mockTargetLocation,
      },
    );
    const filtered = filterRelevantOffersByDistance(
      { offers: relevantOffers, targetLocation: mockTargetLocation },
    );
    const sortedOffers = sortOffersByDistance(
      { offers: filtered },
    );
    expect(sortedOffers[0].name).toBe('Pizza Lila');
    expect(sortedOffers[1].name).toBe('Taizu');
    expect(sortedOffers[2].name).toBe('Safari RamatGan');
    expect(sortedOffers.length).toBe(3);
  });
});
