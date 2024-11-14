const express = require('express');
const TransactionController = require('../controllers/transactionController');

const router = express.Router();

// Process transaction
router.post('/process-transaction', TransactionController.processTransaction);

module.exports = router;
