const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByEmail, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, getBookingsByEmail);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
