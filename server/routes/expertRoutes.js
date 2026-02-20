const express = require('express');
const router = express.Router();
const { getExperts, getExpertById, addSlot } = require('../controllers/expertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getExperts);
router.get('/:id', getExpertById);
router.post('/slots', protect, authorize('expert'), addSlot);

module.exports = router;
