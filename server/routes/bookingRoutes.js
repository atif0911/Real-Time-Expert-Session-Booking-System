const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByEmail } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, getBookingsByEmail);

module.exports = router;
