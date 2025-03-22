const fs = require('fs');
const setupDefaultFiles = require('./utils/setupDefaults');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');
const { PORT, NODE_ENV } = require('./config/environment');

// Route imports
const userRoutes = require('./routes/userRoutes');
const podcastRoutes = require('./routes/podcastRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Important for images
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up default files
setupDefaultFiles();

const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(__dirname, 'public/uploads');
const podcastsDir = path.join(__dirname, 'public/uploads/podcasts');
const coversDir = path.join(__dirname, 'public/uploads/covers');
const categoriesDir = path.join(__dirname, 'public/uploads/categories');
const defaultDir = path.join(__dirname, 'public/uploads/default');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(podcastsDir)) {
  fs.mkdirSync(podcastsDir);
}
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir);
}
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir);
}
if (!fs.existsSync(defaultDir)) {
  fs.mkdirSync(defaultDir, { recursive: true });
}
// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Also serve the entire public directory
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
// Connect to Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/categories', categoryRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);


});

module.exports = app;