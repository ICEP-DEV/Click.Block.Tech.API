const express = require('express');
const router = express.Router();
const { getMessageById, getMessagesByCustomerID, getAllMessages } = require('../controllers/contactMeMessageController');

router.get('/messages/:MessageID', getMessageById);
router.get('/customers/:CustID_Nr/messages', getMessagesByCustomerID);
router.get('/messages', getAllMessages);  
module.exports = router;
