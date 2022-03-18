require('dotenv').config();
const {
  USER_END_POINT, NON_EXISTING_USER_ID, EXISTING_USER_ID, testNetwork,
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
      console.log(error);
      const { response: { status } } = error;
      expect(status).toBe(404);
    }
  });
});
