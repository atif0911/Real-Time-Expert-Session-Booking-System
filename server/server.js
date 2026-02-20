require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev, restrict in prod
    methods: ["GET", "POST"]
  }
});

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/experts', expertRoutes);
app.use('/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
