const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*",  // allow all origins (for testing)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const formRoutes = require('./routes/form');
app.use(formRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});