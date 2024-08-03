import { createClient } from 'redis';

class RedisClient {
  constructor() {

    this.client = createClient();
    this.ready = true;
    this.client.on('error', (err) => {
      console.log(err);
      this.ready = false;
    });
    dthis.client.connect();
  }

  isAlive() {
    return this.ready;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, duration) {
    await this.client.set(key, value, {
        EX: duration,
    });
  }

  async del(key) {
      await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
