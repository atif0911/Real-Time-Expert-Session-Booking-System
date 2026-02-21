const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expert = require('../models/Expert');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check both collections depending on role or just try to find ID
      // Improved: Store role in token
      if (decoded.role === 'expert') {
        req.user = await Expert.findById(decoded.id).select('-password');
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user.role = decoded.role; // Attach role to req.user

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'undefined'} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };
