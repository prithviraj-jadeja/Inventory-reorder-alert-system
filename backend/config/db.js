require('dotenv').config();
// config/db.js
const mongoose = require("mongoose");

// Set strictQuery explicitly to suppress the warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});  // Remove deprecated options
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:__", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
