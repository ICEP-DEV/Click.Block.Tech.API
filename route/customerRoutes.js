const express = require('express');
const { createCustomer, getCustomer, getAccountID, verifyOtp, updateCustomerStep, getCustomerByAccNr} = require('../controllers/customerController');

const router = express.Router();

router.post('/customers', createCustomer); 
router.patch('/customers/:custID_Nr', updateCustomerStep);
router.get('/get_customer/:custID_Nr', getCustomer);
router.post('/customers/verify-otp', verifyOtp);
router.get('/get_accountNr/:AccountNr', getAccountID);
router.get('/get_customer_byID/:AccountNr/:LoginPin/', getCustomerByAccNr);

module.exports = router;
