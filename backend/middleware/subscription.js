const Subscription = require('../models/Subscription');
const User = require('../models/User');

const checkSubscription = async (req, res, next) => {
  try {
    let subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription) {
      subscription = await Subscription.create({
        userId: req.user._id,
        plan: 'free',
        notesLimit: 10
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Subscription check failed' });
  }
};

const checkNotesLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.notesCount >= req.subscription.notesLimit) {
      return res.status(403).json({ 
        error: 'Notes limit reached. Upgrade your plan.',
        limit: req.subscription.notesLimit 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Limit check failed' });
  }
};

module.exports = { checkSubscription, checkNotesLimit };