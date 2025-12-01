const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name = '', email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error:'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success:false, error:'User exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    req.session.userId = user._id;
    res.json({ success:true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error:'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error:'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, error:'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success:false, error:'Invalid credentials' });

    req.session.userId = user._id;
    res.json({ success:true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error:'Server error' });
  }
});

// Status
router.get('/status', (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success:false });
    res.clearCookie('sid');
    res.json({ success:true });
  });
});

module.exports = router;