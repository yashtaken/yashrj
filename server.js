require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // optional but recommended
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';
const SESSION_SECRET = process.env.SESSION_SECRET || 'keyboard-cat';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  name: 'sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI, collectionName: 'sessions' }), // recommended
  cookie: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || 24*60*60*1000), // default 24h
    httpOnly: true,
    // secure: true, // enable if using HTTPS
    sameSite: 'lax'
  }
}));

// Simple helper: check if logged in
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// ---------- AUTH ROUTES ----------

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ email, passwordHash });
    await user.save();

    // create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    res.json({ ok: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.userId = user._id;
    req.session.userEmail = user.email;

    res.json({ ok: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('sid');
    res.json({ ok: true });
  });
});

// Check session
app.get('/auth/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ loggedIn: true, user: { id: req.session.userId, email: req.session.userEmail } });
  }
  res.json({ loggedIn: false });
});

// ---------- TODOS API (authenticated) ----------

// Get all todos for logged-in user
app.get('/api/todos', requireAuth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.session.userId }).sort({ createdAt: -1 });
    res.json({ todos });
  } catch (err) {
    console.error('Get todos error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new todo
app.post('/api/todos', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

    const todo = new Todo({ user: req.session.userId, text: text.trim() });
    await todo.save();
    res.json({ todo });
  } catch (err) {
    console.error('Create todo error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update todo (text / completed)
app.put('/api/todos/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = {};
    if (typeof req.body.text === 'string') updates.text = req.body.text.trim();
    if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;
    updates.updatedAt = Date.now();

    const todo = await Todo.findOneAndUpdate({ _id: id, user: req.session.userId }, updates, { new: true });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    res.json({ todo });
  } catch (err) {
    console.error('Update todo error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete todo
app.delete('/api/todos/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Todo.findOneAndDelete({ _id: id, user: req.session.userId });
    if (!result) return res.status(404).json({ error: 'Todo not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete todo error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fallback route: serve index.html for any unmatched route (spa)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
