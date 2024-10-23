const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route for handling transaction
router.post('/transactions', transactionController.processTransaction);

module.exports = router;
