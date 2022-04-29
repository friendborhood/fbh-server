const { createClient } = require('redis');
const logger = require('../../logger');
require('dotenv').config();

class RedisService {
  constructor() {
    this.created = false;
  }

  async init() {
    if (!this.created) {
      logger.info('try init redis');
      const redisUrl = process.env.REDIS_URL;
      if (redisUrl) {
        this.client = createClient({ url: redisUrl });
      } else {
        this.client = createClient();
      }
      await this.client.connect();
      await this.client.flushDb();
      logger.info('success init redis');
      this.created = true;
    }
  }

  async removeKey(key) {
    logger.info(`removing from cache ${key}`);
    await this.client.del(key);
  }

  async setKey(key, value) {
    logger.info(`adding to cache ${key} with value ${value}`);
    await this.client.set(key, value);
  }

  async getKey(key) {
    return this.client.get(key);
  }
}

module.exports = new RedisService();
