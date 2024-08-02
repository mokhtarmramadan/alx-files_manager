const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.ready = false;
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.host}:${this.port}`;
    this.connect();
  }

  async connect() {
    try {
      const client = await MongoClient.connect(this.url);
      this.db = client.db(this.database);
      this.ready = true;
    } catch (err) {
      this.ready = false;
      console.error('MongoDB connection error:', err);
    }
  }

  isAlive() {
    return this.ready;
  }

  async nbUsers() {
    if (!this.ready) {
      throw new Error('Database not connected');
    }
    const usersCollection = this.db.collection('users');
    const numberUsers = await usersCollection.countDocuments();
    return numberUsers;
  }

  async nbFiles() {
    if (!this.ready) {
      throw new Error('Database not connected');
    }
    const filesCollection = this.db.collection('files');
    const numberFiles = await filesCollection.countDocuments();
    return numberFiles;
  }
}

const dbClient = new DBClient();
export default dbClient;
