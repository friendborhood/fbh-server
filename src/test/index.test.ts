import '../api';
import logger from '../logger';
import { validateOfferData, filterOffersByArea, sortOffersByDistance } from '../models/offer';
import {
  USER_END_POINT,
  NON_EXISTING_USER_ID,
  EXISTING_USER_ID,
  testNetwork,
  COMPLEX_OBJECT,
  TEST_OFFERS_CATEGORY,
  OFFERS_END_POINT,
  TEST_USER,
  TEST_RADIUS,
  mockTargetLocation,
  mockDataOffersInArea,
  mockRadius,
  addTokenToNetwork,
  TEST_API_KEY,
} from './utils';

require('dotenv').config();

jest.setTimeout(1000 * 10);
describe('Basic sanity server CRUD tests', () => {
  it('Can get user', async () => {
    const { data, status } = await testNetwork.get(`${USER_END_POINT}/${EXISTING_USER_ID}`);
    expect(data).toBeDefined();
    expect(status).toBe(200);
  });
  it('Return 404 for not exisiting user', async () => {
    try {
      await testNetwork.get(`${USER_END_POINT}/${NON_EXISTING_USER_ID}`);
    } catch (error) {
      logger.warn(error);
      const { response: { status } } = error;
      expect(status).toBe(404);
    }
  });
  it('Logger test', () => {
    logger.info('i am an info', COMPLEX_OBJECT);
    logger.warn('i am a warning ', { warning: 'warn' });
    logger.error(' i am an error', { someError: ['error1', 'error2'] });
  });

  it('Offers in area - E2E', async () => {
    const responseFromLogin = await testNetwork.post(`${USER_END_POINT}/login/${TEST_USER}`, { apiKey: TEST_API_KEY });
    const { token } = responseFromLogin.data;
    addTokenToNetwork(token);
    const { data: offers } = await testNetwork.get(`${OFFERS_END_POINT}/in-area`, {
      params: {
        categoryName: TEST_OFFERS_CATEGORY,
        radius: TEST_RADIUS,
      },
    });
    await Promise.all(offers.map((offer) => validateOfferData(offer)));
    expect(offers[0].distanceFromUser).toBeLessThan(offers[1].distanceFromUser);
    expect(offers.length).toBe(2);
  });
  it('Offers in area - Mock', () => {
    const relevantOffers = filterOffersByArea(
      {
        offers: mockDataOffersInArea,
        radiusInMeters: mockRadius,
        targetLocation: mockTargetLocation,
      },
    );
    const sortedOffers = sortOffersByDistance(
      { offers: relevantOffers, targetLocation: mockTargetLocation },
    );
    expect(sortedOffers[0].name).toBe('Pizza Lila');
    expect(sortedOffers[1].name).toBe('Taizu');
    expect(sortedOffers[2].name).toBe('Safari RamatGan');
    expect(sortedOffers.length).toBe(3);
  });
});
