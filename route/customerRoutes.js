const express = require('express');
const { createCustomer, getCustomer, authenticateCustomer } = require('../controllers/customerController');

const router = express.Router();

router.post('/register_customer/', createCustomer);  
router.get('/get_customer/:custID_Nr', getCustomer); 
router.get('/auth_customer/', authenticateCustomer);  

module.exports = router;
