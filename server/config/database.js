
const mongoose = require('mongoose');
const winston = require('winston');


class Database{
    constructor() {
        this.connection = null;
    };

    async connect() {
        try {
          this.connection = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true
          });
    
          console.log('MongoDB Connected Successfully');
          return this.connection;
        } catch (error) {
          console.log('MongoDB Connection Error:', error);
          process.exit(1);
        }
      }
    
      async disconnect() {
        if (this.connection) {
          await mongoose.disconnect();
          console.log('MongoDB Disconnected');
        }
      }
    }
    
    module.exports = new Database();
