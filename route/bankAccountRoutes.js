const express = require('express');
const { createAccount, getAccount, updateAccount, deleteAccount ,getAccountActions,getAllCustomerDetails,getFilteredAccounts,freezeAccount,deactivateAccount,setTransactionLimit,getTransactionLimit} = require('../controllers/bankAccountController');

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

//Get All Customer details
router.get('/accounts/filter', getFilteredAccounts);

//Freezing bank account
router.put('/freezeBankaccount/freeze/:accountID', freezeAccount);
 
// Deactive Bank Account
router.put('/deactivateBankaccount/deactivate/:accountID', deactivateAccount);

// Set transaction limit for an account
router.put('/updateBankaccount/transaction-limit', setTransactionLimit);


// Get the current transaction limit for an account
router.get('/bankaccount/:accountID/transaction-limit', getTransactionLimit);





module.exports = router;
