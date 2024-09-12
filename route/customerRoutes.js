const express = require('express');
const { createCustomer, getCustomer} = require('../controllers/customerController');

const router = express.Router();

router.post('/customer', createCustomer);  
router.get('/customer/:custID_Nr', getCustomer);  


module.exports = router;
