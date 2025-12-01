const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

function ensureAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error:'Unauthorized' });
  next();
}

// Get todos
router.get('/', ensureAuth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.json({ success: true, todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

// Create
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error:'Text required' });

    const todo = await Todo.create({ text, userId: req.session.userId });
    res.json({ success: true, todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

// Update
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const { text, done } = req.body;
    const updates = {};
    if (typeof text === 'string') updates.text = text;
    if (typeof done === 'boolean') updates.done = done;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      updates,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error:'Not found' });
    res.json({ success: true, todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

// Delete
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    if (!result) return res.status(404).json({ error:'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

module.exports = router;