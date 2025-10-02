// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./config/dbConnection'); // <-- Use the Singleton

dotenv.config({ path: '../.env' }); // Adjusted path for safety

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

const startServer = async () => {
  await dbConnection.connect(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

module.exports = app;