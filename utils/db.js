const { MongoClient } = require('mongodb');

class DBClient {
  constructor () {
    if (!process.env.DB_HOST) {
      this.host = 'localhost';
    }
    if (!process.env.DB_PORT) {
      this.port = 27017;
    }
    if (!process.env.DB_DATABASE) {
      this.database = 'files_manager';
    }
   this.uri = `mongodb://${this.host}:${this.port}`;

   this.client = new MongoClient(this.uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });
   this.connected = false;
   this.connect_db();
 }

  async connect_db() {
    try {
      await client.connect();
      this.connected = true;

      client.db(this.database);
    } catch (err) {
      console.log('Error during client connection', err);
    }
 }

  isAlive() {
    return this.connected;
  }
}

const dbClient = new DBClient();
export default dbClient;
