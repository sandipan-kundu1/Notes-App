const express = require('express');
const Subscription = require('../models/Subscription');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get user subscription
router.get('/', verifyToken, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ userId: req.user._id });
    if (!subscription) {
      subscription = await Subscription.create({ userId: req.user._id });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upgrade subscription
router.post('/upgrade', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const limits = {
      free: { notesLimit: 10, features: { collaboration: false, export: false, analytics: false } },
      pro: { notesLimit: 100, features: { collaboration: true, export: true, analytics: false } },
      enterprise: { notesLimit: -1, features: { collaboration: true, export: true, analytics: true } }
    };

    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user._id },
      { 
        plan,
        ...limits[plan],
        expiresAt: plan !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      },
      { new: true, upsert: true }
    );

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;