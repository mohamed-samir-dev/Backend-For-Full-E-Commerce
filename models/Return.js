const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    nameAr: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    reason: { type: String, required: true }
  }],
  reason: { type: String, required: true },
  details: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminNote: { type: String, default: '' }
}, { timestamps: true });

returnSchema.index({ userId: 1 });
returnSchema.index({ status: 1 });

module.exports = mongoose.model('Return', returnSchema);
