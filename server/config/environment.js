require('dotenv').config({ path: '../.env' });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/podcast_headling',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '2h',
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 