const Order = require('../models/Order');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    // Validate required fields
    const { products, shippingAddress, paymentMethod, totalPrice } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Products are required' });
    }
    
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }
    
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Valid total price is required' });
    }

    const orderData = {
      ...req.body,
      userId: req.user._id,
      isPrivate: true,
      securityLevel: 'high'
    };

    const order = await Order.create(orderData);
    
    const user = await User.findById(req.user._id);
    if (user) {
      user.orders.push(order._id);
      user.cart = [];
      await user.save();
    }

    console.log(`Secure order created: ${order._id} for user: ${req.user._id}`);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('products.productId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({ success: true, data: orders, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('products.productId');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
