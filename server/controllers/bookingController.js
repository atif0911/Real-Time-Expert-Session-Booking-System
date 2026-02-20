const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

exports.createBooking = async (req, res) => {
  const { expertId, date, timeSlot, notes } = req.body;
  
  // User details from Auth Middleware
  const userEmail = req.user.email;
  const userName = req.user.name;
  // Phone is still needed if not in User model, or we can add it to User model.
  // For now let's keep it in body or assume user profile has it.
  // The requirement said "Name, Email, Phone" in form.
  // If we are logged in, we have Name/Email. Phone might need to be passed or added to User.
  const userPhone = req.body.userPhone || "Not Provided"; // Simplify for now

  try {
    // 1. Atomic Check and Update
    // Find the expert and the specific slot, ENSURING it is not already booked.
    // If it finds and updates, we are safe.
    // If it returns null, either expert doesn't exist, slot doesn't exist, or slot is already booked.
    const updatedExpert = await Expert.findOneAndUpdate(
      { 
        _id: expertId, 
        slots: { 
          $elemMatch: { date: date, time: timeSlot, isBooked: false } 
        } 
      },
      { 
        $set: { "slots.$.isBooked": true } 
      },
      { new: true } // Return updated doc
    );

    if (!updatedExpert) {
      return res.status(400).json({ message: 'Slot already booked or invalid.' });
    }

    // 2. Create Booking Record
    const booking = new Booking({
      expertId,
      userEmail,
      userName,
      userPhone,
      date,
      timeSlot,
      notes,
      status: 'Confirmed'
    });

    await booking.save();

    // 3. Emit Real-Time Update
    // We emit to everyone so they see the slot is gone.
    // Using req.io which we will attach in server.js
    if (req.io) {
        req.io.emit('slotUpdate', { expertId, date, timeSlot, isBooked: true });
    }

    res.status(201).json(booking);
  } catch (err) {
    // If we failed to create booking (e.g. DB error), we should technically roll back the slot.
    // For MVP, we'll log it. In production, use transactions.
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const email = req.user.email;
    const bookings = await Booking.find({ userEmail: email }).populate('expertId', 'name category');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
