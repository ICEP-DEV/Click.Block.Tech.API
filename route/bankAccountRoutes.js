const express = require('express');
const { createAccount, getAccount, updateAccount, deleteAccount ,getAccountActions,getAllCustomerDetails,getFilteredAccounts} = require('../controllers/bankAccountController');

const router = express.Router();

router.post('/bankaccount', createAccount);
router.get('/bankaccount/:accountID', getAccount);
router.put('/bankaccount/:accountID', updateAccount);
router.delete('/bankaccount/:accountID', deleteAccount);
router.put('/update_accountStatus/:accountID', updateAccount);
//Admin Stats : Route for account actions
router.get('/account-actions', getAccountActions); 

//Admin Stats : Customer Accounts Management
router.get('/customers/details', getAllCustomerDetails);

router.get('/accounts/filter', getFilteredAccounts);



module.exports = router;
