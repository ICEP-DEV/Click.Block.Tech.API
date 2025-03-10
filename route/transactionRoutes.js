const express = require('express');
const {updateTransacPanicStatus,getTransactionByID,updateAccountBalance,createTransaction, getAllTransactionsByAccID,getTransactionsByAccID, updateTransactionStatus, getBankAccount, fetchTransactions, sendEmailWithPdf}= require('../controllers/transactionController');


const router = express.Router();

// Process transaction
router.post('/create_transaction', createTransaction);
router.get('/getTransaction_byAccID/:accountID/:status', getTransactionsByAccID);
router.put('/updateTransaction', updateTransactionStatus);
router.get('/getBankAccount/:accountID',getBankAccount);
router.put('/subtract_AccBalance', updateAccountBalance );
router.get('/getTransactionByID/:transactionID',getTransactionByID);
router.put('/updateTransacPanicStatus', updateTransacPanicStatus);

router.get('/getAllTransactionByAccID/:accountID', getAllTransactionsByAccID);

router.get('/generate-statement', fetchTransactions);
router.post('/send-email-with-pdf', sendEmailWithPdf);

module.exports = router;
