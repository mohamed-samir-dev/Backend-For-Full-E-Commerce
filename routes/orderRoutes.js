const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id', protect, authorize('admin'), updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;
