const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Contact = require('../models/Contact');

exports.getDashboardStats = async (req, res) => {
  try {
    const [products, orders, users, contacts] = await Promise.all([
      Product.find(),
      Order.find().populate('userId', 'name email').sort({ createdAt: -1 }),
      User.find(),
      Contact.find()
    ]);

    const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const lowStock = products.filter(product => product.stock < 10).length;
    const recentOrders = orders.slice(0, 5);
    const avgOrderValue = orders.length > 0 ? Math.round(revenue / orders.length) : 0;

    res.json({
      success: true,
      data: {
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue,
        pendingOrders,
        completedOrders,
        contacts: contacts.length,
        lowStock,
        avgOrderValue,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
