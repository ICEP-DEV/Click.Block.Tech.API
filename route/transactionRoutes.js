const express = require('express');
const TransactionController = require('../controllers/transactionController');

const router = express.Router();

// Process transaction
router.post('/process-transaction', TransactionController.processTransaction);

// Approve or decline transaction
router.post('/approve-transaction', TransactionController.approveTransaction);

module.exports = router;
