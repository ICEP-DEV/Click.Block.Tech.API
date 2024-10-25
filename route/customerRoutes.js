const express = require('express');

const { createCustomer, getCustomer, getAccountID, verifyOtp, updateCustomerStep, getCustomerByAccNr,verifyOldPin,updateCustomerDetails} = require('../controllers/customerController');


const router = express.Router();

router.post('/customers', createCustomer); 
router.patch('/customers/:custID_Nr', updateCustomerStep);
router.get('/get_customer/:custID_Nr', getCustomer);
router.post('/customers/verify-otp', verifyOtp);
router.get('/get_accountNr/:AccountNr', getAccountID);
router.get('/get_customer_byID/:AccountNr/:LoginPin/', getCustomerByAccNr);


//verify the old pin
router.post('/customers/verify-pin', verifyOldPin);
 


//update Customer
router.put('/customers/:custID_Nr',updateCustomerDetails);
module.exports = router;


