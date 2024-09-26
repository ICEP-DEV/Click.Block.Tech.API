const express = require('express');
const { createCustomer, getCustomer, verifyOtp } = require('../controllers/customerController');

const router = express.Router();

router.post('/customer', createCustomer); 
router.get('/customer/:custID_Nr', getCustomer);
router.post('/customer/verifyOtp', verifyOtp);

module.exports = router;
