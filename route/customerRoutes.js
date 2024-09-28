const express = require('express');
const { createCustomer, getCustomer, verifyOtp, updateCustomerStep } = require('../controllers/customerController');

const router = express.Router();

router.post('/customers', createCustomer); 
router.patch('/customers/:custID_Nr', updateCustomerStep);
router.get('/customers/:custID_Nr', getCustomer);
router.post('/customers/verify-otp', verifyOtp);

module.exports = router;
