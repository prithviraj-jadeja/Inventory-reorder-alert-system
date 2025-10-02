// backend/config/dbConnection.js
const mongoose = require('mongoose');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this._connection = null;
    Database.instance = this;
  }

  async connect(uri) {
    if (this._connection) {
      console.log('MongoDB is already connected.');
      return this._connection;
    }
    try {
      await mongoose.connect(uri);
      this._connection = mongoose.connection;
      console.log('MongoDB connected successfully via Singleton.');
    } catch (error) {
      console.error('MongoDB connection error:$$$', uri, error.message);
      process.exit(1);
    }
  }
}
const instance = new Database();
module.exports = instance;