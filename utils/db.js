const { MongoClient } = require('mongodb');

class DBClient {
  constructor () {
    this.ready = true;
    this.host = process.env.DB_HOST;
    this.port = process.env.DB_PORT;
    this.database = process.env.DB_DATABASE;

    if (!process.env.DB_HOST) {
      this.host = 'localhost';
    }
    if (!process.env.DB_PORT) {
      this.port = 27017;
    }
    if (!process.env.DB_DATABASE) {
      this.database = 'files_manager';
    }

   this.url = `mongodb://${this.host}:${this.port}`;

   MongoClient.connect(this.url,{useUnifiedTopology: true},(err, client) => {
 
    if (err) {
      this.ready = false
      console.log("i am goody ")
      return console.log(err)
    }

    console.log("Ahmed")
    this.db = client.db(`${this.database}`)
    console.log(this.userCollection)
    console.log(`MongoDB Connected: ${this.url}`)

   });
  }

  isAlive() {
    return this.ready;
  }

  async nbUsers() {
     this.usersCollection = this.db.collection('users');
     const number_users = await this.usersCollection.countDocuments();
     return number_users;
  }

  async nbFiles() {
    this.filesCollection = this.db.collection('files');
    const number_files = await this.filesCollection.countDocuments();
    return number_files;
  }
}

const dbClient = new DBClient();
export default dbClient;
