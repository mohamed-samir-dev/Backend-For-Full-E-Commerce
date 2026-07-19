const express = require('express');
const router = express.Router();
const { createReturn, getUserReturns, getAllReturns, updateReturnStatus } = require('../controllers/returnController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createReturn);
router.get('/my', protect, getUserReturns);
router.get('/', protect, authorize('admin'), getAllReturns);
router.put('/:id/status', protect, authorize('admin'), updateReturnStatus);

module.exports = router;
