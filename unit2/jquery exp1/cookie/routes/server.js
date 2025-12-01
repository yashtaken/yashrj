require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connect failed:', err);
    process.exit(1);
  });

// Session (stored in Mongo)
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'sessions' }),
  cookie: {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// API routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// Serve index for root
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// start
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));