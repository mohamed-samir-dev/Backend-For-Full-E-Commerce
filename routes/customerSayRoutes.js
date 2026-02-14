const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createCustomerSay,
  getApprovedCustomerSays,
  getAllCustomerSays,
  updateApprovalStatus,
  deleteCustomerSay
} = require('../controllers/customerSayController');

router.post('/', createCustomerSay);
router.get('/approved', getApprovedCustomerSays);
router.get('/all', protect, admin, getAllCustomerSays);
router.put('/:id/approval', protect, admin, updateApprovalStatus);
router.delete('/:id', protect, admin, deleteCustomerSay);

module.exports = router;
