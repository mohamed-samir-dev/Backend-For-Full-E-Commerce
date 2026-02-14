const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', createContact);
router.get('/', protect, admin, getAllContacts);
router.patch('/:id/status', protect, admin, updateContactStatus);

module.exports = router;
