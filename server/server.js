require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const cloudinary = require('cloudinary').v2;
const { PORT, NODE_ENV } = require('./config/environment');

// Route imports
const userRoutes = require('./routes/userRoutes');
const podcastRoutes = require('./routes/podcastRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


// Routes
app.use('/api/users', userRoutes);
app.use('/api/podcasts', podcastRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

});

module.exports = app;