const express = require('express');
const { createCustomer, getCustomer, getAccountID} = require('../controllers/customerController');

const router = express.Router();

router.post('/register_customer/', createCustomer);  
router.get('/get_customer/:custID_Nr', getCustomer); 
router.get('/get_accountNr/:AccountNr', getAccountID);  

module.exports = router;
