require('dotenv').config();
const axios = require('axios');
const e = require('express');

jest.setTimeout(1000 * 10);
describe('Basic sanity server CRUD tests', () => {
  beforeEach(async () => {
  });
  it('Can get user', async () => {
    const { data, status } = await axios.get('http://localhost:3000/users/1');
    expect(data).toBeDefined();
    expect(status).toBe(200);
  });
  it('Return 404 for not exisiting user', async () => {
    try {
      await axios.get('http://localhost:3000/users/700');
    } catch (error) {
      const { response: { status } } = error;
      expect(status).toBe(404);
    }
  });
});
