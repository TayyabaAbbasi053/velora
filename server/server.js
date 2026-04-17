const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Velora server is running! 🚀');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});