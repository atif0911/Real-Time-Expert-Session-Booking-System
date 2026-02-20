const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerExpert } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/register-expert', registerExpert);

module.exports = router;
