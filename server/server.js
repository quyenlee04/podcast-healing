const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');



const app = express();

// Nhat ky cau hinh
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});


// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection database 
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

//routes
// const userRoutes = require('./routes/userRoutes');
// const podcastRoutes = require('./routes/podcastRoutes');
// const commentRoutes = require('./routes/commentRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// app.use('/api/users', userRoutes);
// app.use('/api/podcasts', podcastRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/admin', adminRoutes);

// error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

//server configuration
const PORT = process.env.PORT;
const server = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

server();

//Shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
module.exports = app;

