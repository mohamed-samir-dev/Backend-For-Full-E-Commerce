const Return = require('../models/Return');
const Order = require('../models/Order');

exports.createReturn = async (req, res) => {
  try {
    const { orderId, items, reason, details } = req.body;

    if (!orderId || !items?.length || !reason) {
      return res.status(400).json({ success: false, message: 'orderId, items, and reason are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Only delivered orders can be returned' });
    }

    const existing = await Return.findOne({ orderId, userId: req.user._id, status: { $in: ['pending', 'approved'] } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A return request already exists for this order' });
    }

    const returnRequest = await Return.create({
      userId: req.user._id,
      orderId,
      items,
      reason,
      details: details || ''
    });

    res.status(201).json({ success: true, data: returnRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReturns = async (req, res) => {
  try {
    const returns = await Return.find({ userId: req.user._id })
      .populate('orderId', 'createdAt totalPrice')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReturns = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'all' ? { status } : {};

    const returns = await Return.find(query)
      .populate('userId', 'name email')
      .populate('orderId', 'createdAt totalPrice')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Return.countDocuments(query);
    res.json({ success: true, data: returns, total: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ['pending', 'approved', 'rejected', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const returnRequest = await Return.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || '' },
      { new: true }
    ).populate('userId', 'name email').populate('orderId', 'createdAt totalPrice');

    if (!returnRequest) return res.status(404).json({ success: false, message: 'Return not found' });

    res.json({ success: true, data: returnRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
