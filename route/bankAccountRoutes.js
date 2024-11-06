const express = require('express');
const { createAccount, getAccount, updateAccount, deleteAccount } = require('../controllers/bankAccountController');

const router = express.Router();

router.post('/bankaccount', createAccount);
router.get('/bankaccount/:accountID', getAccount);
router.put('/bankaccount/:accountID', updateAccount);
router.delete('/bankaccount/:accountID', deleteAccount);
router.put('/update_accountStatus/:accountID', updateAccount);

module.exports = router;
