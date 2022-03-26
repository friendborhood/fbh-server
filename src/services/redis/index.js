const { createClient } = require('redis');

class RedisService {
  constructor() {
    this.created = false;
  }

  async init() {
    if (!this.created) {
      console.log('try init redis');
      const rtg = process.env.REDISTOGO_URL;
      if (rtg) {
        this.client.createClient(rtg.port, rtg.hostname);
        this.client.auth(rtg.auth.split(':')[1]);
      } else {
        this.client = createClient();
      }
      await this.client.connect();
      console.log('success init redis');
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
