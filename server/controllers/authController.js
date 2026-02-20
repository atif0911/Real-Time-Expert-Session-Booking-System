const User = require('../models/User');
const Expert = require('../models/Expert');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body; // role can be 'user' or 'expert' if we allow expert self-registration

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user' // Default to user for safety
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body; // Role is required to know which collection to search

  try {
    let user;
    if (role === 'expert') {
        user = await Expert.findOne({ email });
    } else {
        user = await User.findOne({ email });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role, // Return the role requested/found
        token: generateToken(user._id, role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new expert (For demo/admin purposes)
// @route   POST /auth/register-expert
// @access  Public (Should be protected in prod)
exports.registerExpert = async (req, res) => {
    const { name, email, password, category, experience, about } = req.body;
  
    try {
      const expertExists = await Expert.findOne({ email });
  
      if (expertExists) {
        return res.status(400).json({ message: 'Expert already exists' });
      }
  
      const expert = await Expert.create({
        name,
        email,
        password,
        category,
        experience,
        about
      });
  
      if (expert) {
        res.status(201).json({
          _id: expert._id,
          name: expert.name,
          email: expert.email,
          role: 'expert',
          token: generateToken(expert._id, 'expert'),
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
