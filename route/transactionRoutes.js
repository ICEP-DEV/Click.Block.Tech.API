const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');

router.post('/transactions', TransactionController.handleTransaction);

module.exports = router;