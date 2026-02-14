const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, addRating, getReviews, approveReview, getFilterOptions, searchProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createProduct);
router.get('/', getProducts);
router.get('/filter-options', getFilterOptions);
router.get('/search', searchProducts);
router.get('/:id', getProduct);
router.get('/:id/reviews', getReviews);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/ratings', protect, addRating);
router.patch('/:id/reviews/:reviewId/approve', protect, authorize('admin'), approveReview);

module.exports = router;
