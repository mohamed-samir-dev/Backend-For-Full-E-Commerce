const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist, syncWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/sync', syncWishlist);
router.post('/add/:productId', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);

module.exports = router;
