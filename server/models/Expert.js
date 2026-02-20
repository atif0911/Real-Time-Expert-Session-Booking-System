const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: String, required: true }, // e.g., "5 years"
  email: { type: String, required: true, unique: true }, // Auth
  password: { type: String, required: true }, // Auth
  rating: { type: Number, default: 0 },
  about: { type: String }, // specific requirement: display expert details
  // Availability could be complex, but for this deadline, let's keep it simple.
  // We can assume experts are available 9-5 or have specific slots.
  // For Real-Time nature, slots should be generated or stored.
  // Let's store available slots in a separate collection or embedded?
  // Embedded is easier for reads.
  slots: [{
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const bcrypt = require('bcryptjs');

expertSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

expertSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Expert', expertSchema);
