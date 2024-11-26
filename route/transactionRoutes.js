const express = require('express');
const TransactionController = require('../controllers/transactionController');

const router = express.Router();

// Process transaction
router.post('/process-transaction', TransactionController.processTransaction);
router.get('/getTransaction_byAccID/:accountID/:status', TransactionController.getTransactionsByAccID);
router.put('/updateTransaction', TransactionController.updateTransactionStatus);
router.put('/update_bankBalance',TransactionController.updateBankBalance);
module.exports = router;
