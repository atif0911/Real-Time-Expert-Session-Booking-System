const Expert = require('../models/Expert');

// Get all experts with filtering and pagination
exports.getExperts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const start = (page - 1) * limit; // skipping

    // Since slots might be large, we might want to exclude them from list view if performance is an issue.
    // But for now, returning everything is fine.
    const experts = await Expert.find(query)
      .limit(limit * 1)
      .skip(start)
      .exec();

    const count = await Expert.countDocuments(query);

    res.json({
      experts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single expert
exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.json(expert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a slot (Protected, Expert only)
exports.addSlot = async (req, res) => {
  try {

        const { date, time } = req.body;
        
        const expert = await Expert.findById(req.user._id);
        
        if (!expert) return res.status(404).json({ message: 'Expert not found' });

        const slotExists = expert.slots.some(slot => slot.date === date && slot.time === time);
        if (slotExists) {
            return res.status(400).json({ message: 'Slot already exists for this date and time' });
        }

        expert.slots.push({ date, time, isBooked: false });
        
        await expert.save();
        

        res.status(201).json(expert.slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
