const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getCart, addToWishlist, removeFromWishlist, getWishlist, addAddress, deleteAddress, getAllUsers, deleteUser, getProfile, updateProfile, resetUserPassword } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.post('/cart', protect, addToCart);
router.delete('/cart/:productId', protect, removeFromCart);
router.get('/cart', protect, getCart);

router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/reset-password', protect, authorize('admin'), resetUserPassword);

module.exports = router;
