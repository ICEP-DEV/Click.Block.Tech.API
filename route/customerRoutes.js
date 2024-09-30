const express = require('express');
const { createCustomer, getCustomer, getCustomerAccount } = require('../controllers/customerController');

const router = express.Router();

router.post('/customer', createCustomer);  
router.get('/customer/:custID_Nr', getCustomer);  
router.get('/customer/:custID_Nr/account', getCustomerAccount); // Updated to use 'custID_Nr'

module.exports = router;
