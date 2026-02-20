const mongoose = require('mongoose');
const Expert = require('./models/Expert');
require('dotenv').config();

const experts = [
  // Psychology
  {
    name: "Dr. Alice Smith",
    email: "alice@expert.com",
    password: "password123",
    category: "Psychology",
    experience: "10 years",
    rating: 4.8,
    about: "Specialist in cognitive behavioral therapy and anxiety management.",
    slots: [
      { date: "2026-02-21", time: "10:00", isBooked: false },
      { date: "2026-02-21", time: "11:00", isBooked: false },
      { date: "2026-02-21", time: "14:00", isBooked: false },
      { date: "2026-02-22", time: "09:00", isBooked: false }
    ]
  },
  {
    name: "Dr. John Doe",
    email: "john@expert.com",
    password: "password123",
    category: "Psychology",
    experience: "15 years",
    rating: 4.9,
    about: "Expert in relationship counseling and family therapy.",
    slots: [
      { date: "2026-02-21", time: "13:00", isBooked: false },
      { date: "2026-02-21", time: "15:00", isBooked: false },
      { date: "2026-02-22", time: "10:00", isBooked: false }
    ]
  },
  
  // Career Coaching
  {
    name: "Mr. Bob Jones",
    email: "bob@expert.com",
    password: "password123",
    category: "Career Coaching",
    experience: "8 years",
    rating: 4.5,
    about: "Expert in resume building, interview prep, and career transitions.",
    slots: [
      { date: "2026-02-21", time: "09:00", isBooked: false },
      { date: "2026-02-21", time: "13:00", isBooked: false },
      { date: "2026-02-22", time: "10:00", isBooked: false },
      { date: "2026-02-23", time: "11:00", isBooked: false }
    ]
  },
  {
    name: "Ms. Sarah Lee",
    email: "sarah@expert.com",
    password: "password123",
    category: "Career Coaching",
    experience: "12 years",
    rating: 4.7,
    about: "Executive coach specializing in leadership development.",
    slots: [
      { date: "2026-02-21", time: "16:00", isBooked: false },
      { date: "2026-02-22", time: "14:00", isBooked: false }
    ]
  },

  // Nutrition
  {
    name: "Ms. Carol White",
    email: "carol@expert.com",
    password: "password123",
    category: "Nutrition",
    experience: "5 years",
    rating: 4.9,
    about: "Certified nutritionist focusing on holistic health and weight management.",
    slots: [
      { date: "2026-02-21", time: "15:00", isBooked: false },
      { date: "2026-02-21", time: "16:00", isBooked: false },
      { date: "2026-02-21", time: "17:00", isBooked: false }
    ]
  },

  // Fitness
  {
    name: "Mike Tyson",
    email: "mike@expert.com",
    password: "password123",
    category: "Fitness",
    experience: "20 years",
    rating: 5.0,
    about: "Former pro boxer offering high-intensity interval training (HIIT).",
    slots: [
      { date: "2026-02-21", time: "06:00", isBooked: false },
      { date: "2026-02-21", time: "07:00", isBooked: false },
      { date: "2026-02-22", time: "06:00", isBooked: false }
    ]
  },

  // Financial Planning
  {
    name: "Emily Clark",
    email: "emily@expert.com",
    password: "password123",
    category: "Financial Planning",
    experience: "7 years",
    rating: 4.6,
    about: "Helping you manage debt, savings, and investments for a secure future.",
    slots: [
      { date: "2026-02-21", time: "12:00", isBooked: false },
      { date: "2026-02-22", time: "12:00", isBooked: false }
    ]
  },

  // Legal Advice
  {
    name: "Saul Goodman",
    email: "saul@expert.com",
    password: "password123",
    category: "Legal Advice",
    experience: "18 years",
    rating: 4.4,
    about: "Specialized in criminal law and small business litigation. Better call Saul!",
    slots: [
      { date: "2026-02-21", time: "14:00", isBooked: false },
      { date: "2026-02-21", time: "18:00", isBooked: false },
      { date: "2026-02-22", time: "09:30", isBooked: false }
    ]
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log("Connected to DB");
        
        await Expert.deleteMany({});
        // Passwords will be hashed by the pre-save hook in the model!
        // insertMany skips pre-save hooks in some versions or depending on options.
        // It's safer to use create or loop save for hashing.
        
        for (const expertData of experts) {
            const expert = new Expert(expertData);
            await expert.save();
        }
        
        console.log("Database seeded with " + experts.length + " experts.");
        process.exit();
    } catch (err) {
        console.error("Seed Error:", err.message);
        if (err.message.includes("SSL")) {
            console.error("Hint: Check if your IP is whitelisted in MongoDB Atlas.");
        }
        process.exit(1);
    }
};

seedDB();
