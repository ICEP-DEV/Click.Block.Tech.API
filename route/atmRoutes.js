const express = require('express');
const router = express.Router();

const {verifyCardNumber,AuthenticateCustomer} = require('../controllers/atmController');

router.get('/authenticate/:inputPIN/:encryptStoredPIN', AuthenticateCustomer);
router.get('/verifyCardNumber/:cardNumber', verifyCardNumber);


module.exports = router;