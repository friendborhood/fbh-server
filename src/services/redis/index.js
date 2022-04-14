const { createClient } = require('redis');
require('dotenv').config();

class RedisService {
  constructor() {
    this.created = false;
  }

  async init() {
    if (!this.created) {
      console.log('try init redis');
      const redisUrl = process.env.REDIS_URL;
      if (redisUrl) {
        this.client = createClient({ url: redisUrl });
      } else {
        this.client = createClient();
      }
      await this.client.connect();
      await this.client.flushDb();
      console.log('success init redis');
      this.created = true;
    }
  }

  async removeKey(key) {
    console.log(`removing from cache ${key}`);
    await this.client.del(key);
  }

  async setKey(key, value) {
    console.log(`adding to cache ${key} with value ${value}`);
    await this.client.set(key, value);
  }

  async getKey(key) {
    return this.client.get(key);
  }
}

module.exports = new RedisService();
