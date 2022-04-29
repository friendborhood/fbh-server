require('dotenv').config();
const logger = require('../logger');
const { validateOfferData } = require('../models/offer');
const {
  USER_END_POINT,
  NON_EXISTING_USER_ID,
  EXISTING_USER_ID,
  testNetwork,
  COMPLEX_OBJECT,
  TEST_OFFERS_CATEGORY,
  OFFERS_END_POINT,
  TEST_USER,
  TEST_RADIUS,
} = require('./utils');
require('../api');

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
    const { data: offers } = await testNetwork.get(`${OFFERS_END_POINT}/in-area/${TEST_USER}`, {
      params: {
        category: TEST_OFFERS_CATEGORY,
        radius: TEST_RADIUS,
      },
    });
    await Promise.all(offers.map((offer) => validateOfferData(offer)));
    expect(offers.length).toBe(2);
  });
  it('Offers in area - Mock', async () => {

  });
});
