const express = require('express');
const router = express.Router();
const {createMessage,getMessage,updateMessageStatus, deleteMessage,getAllMessages, getChatBotResponse} = require('../controllers/contactMeMessageController');


router.post('/contactmessages', createMessage);
router.get('/contactmessages/:messageID', getMessage);
router.put('/contactmessages/:messageID/status', updateMessageStatus);
router.delete('/contactmessages/:messageID', deleteMessage);
router.get('/messages', getAllMessages);
router.put('/chatbotResponse/', getChatBotResponse);
//Get all contact messages


module.exports = router;
