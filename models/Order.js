const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    nameAr: {
      type: String
    },
    image: {
      type: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    selectedOptions: {
      size: String,
      color: String
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  securityLevel: {
    type: String,
    enum: ['standard', 'high', 'maximum'],
    default: 'high'
  },
  encryptedData: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
