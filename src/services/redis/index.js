const { createClient } = require('redis');

class RedisService {
  constructor() {
    this.created = false;
    console.log(this.created);
  }

  async init() {
    if (!this.created) {
      console.log('redis created');
      this.client = createClient();
      await this.client.connect();
      this.created = true;
    }
  }

  async setKey(key, value) {
    await this.client.set(key, value);
  }

  async getKey(key) {
    return this.client.get(key);
  }
}

module.exports = new RedisService();
