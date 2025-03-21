const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/environment');

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();

    } catch (error) {
      res.status(401).json({
        message: 'Not authorized, token failed',
        error: error.message
      });
    }
  } else {
    // No token provided
    res.status(403).json({
      message: 'No token, authorization denied'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Admin access required'
    });
  }
};

// Add this function to your existing authMiddleware file



module.exports = {
  protect,
  adminOnly
};