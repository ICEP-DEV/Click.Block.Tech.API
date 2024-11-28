const express = require('express');
const {createTransaction, getTransactionsByAccID, updateTransactionStatus, getBankAccount}= require('../controllers/transactionController');


const router = express.Router();

// Process transaction
router.post('/create_transaction', createTransaction);
router.get('/getTransaction_byAccID/:accountID/:status', getTransactionsByAccID);
router.put('/updateTransaction', updateTransactionStatus);
router.get('/getBankAccount/:accountID',getBankAccount);
module.exports = router;
