const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true }, // Required field
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true }, // HH:mm
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Confirmed' // Direct confirmation for this MVP unless manual approval needed
  }
}, { timestamps: true });

// Compound index to prevent double booking at DB level as a safety net
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
