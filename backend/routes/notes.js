const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { checkSubscription, checkNotesLimit } = require('../middleware/subscription');
const router = express.Router();

// Get all notes for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, category, priority, tags } = req.query;
    let query = { 
      $or: [
        { userId: req.user._id },
        { sharedWith: req.user._id },
        { isPublic: true }
      ]
    };

    if (search) {
      query.$and = [{ $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]}];
    }
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (tags) query.tags = { $in: tags.split(',') };

    const notes = await Note.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create note
router.post('/', verifyToken, checkSubscription, checkNotesLimit, async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id
    });
    
    await User.findByIdAndUpdate(req.user._id, { 
      $inc: { notesCount: 1 },
      lastActive: new Date()
    });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update note
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete note
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    
    await User.findByIdAndUpdate(req.user._id, { $inc: { notesCount: -1 } });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Share note
router.post('/:id/share', verifyToken, checkSubscription, async (req, res) => {
  try {
    if (!req.subscription.features.collaboration) {
      return res.status(403).json({ error: 'Collaboration feature not available' });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $addToSet: { sharedWith: user._id } },
      { new: true }
    );
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export notes
router.get('/export', verifyToken, checkSubscription, async (req, res) => {
  try {
    if (!req.subscription.features.export) {
      return res.status(403).json({ error: 'Export feature not available' });
    }

    const notes = await Note.find({ userId: req.user._id });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=notes-export.json');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;