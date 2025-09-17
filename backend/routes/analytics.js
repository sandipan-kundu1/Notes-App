const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { checkSubscription } = require('../middleware/subscription');
const router = express.Router();

// Get user analytics
router.get('/', verifyToken, checkSubscription, async (req, res) => {
  try {
    if (!req.subscription.features.analytics) {
      return res.status(403).json({ error: 'Analytics feature not available in your plan' });
    }

    const userId = req.user._id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const analytics = await Promise.all([
      Note.countDocuments({ userId }),
      Note.countDocuments({ userId, createdAt: { $gte: thirtyDaysAgo } }),
      Note.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Note.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      totalNotes: analytics[0],
      notesThisMonth: analytics[1],
      categoriesBreakdown: analytics[2],
      priorityBreakdown: analytics[3]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;