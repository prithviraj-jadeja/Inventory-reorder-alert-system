const mongoose = require("mongoose");

let connectionInstance = null; 

class Database {
  constructor() {
    if (connectionInstance) {

      throw new Error("A single database connection instance already exists!");
    }
  }

  static async connect() {
    if (!connectionInstance) {
      connectionInstance = await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
    }

    return connectionInstance;
  }
}


Object.freeze(Database);
module.exports = Database;