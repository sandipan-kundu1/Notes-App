const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  notesLimit: { type: Number, default: 10 },
  expiresAt: { type: Date },
  features: {
    collaboration: { type: Boolean, default: false },
    export: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);