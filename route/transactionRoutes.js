const express = require('express');
const TransactionController = require('../controllers/transactionController');

const router = express.Router();

// Process transaction
router.post('/process-transaction', TransactionController.processTransaction);
router.get('/pending-transaction/:custID_Nr', TransactionController.getLatestPendingTransaction);

module.exports = router;
