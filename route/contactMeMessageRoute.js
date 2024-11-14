const express = require('express');
const router = express.Router();
const contactMeMessageController = require('../controllers/contactMeMessageController');

router.post('/contactmessages', contactMeMessageController.createMessage);
router.get('/contactmessages/:messageID', contactMeMessageController.getMessage);
router.put('/contactmessages/:messageID/status', contactMeMessageController.updateMessageStatus);
router.delete('/contactmessages/:messageID', contactMeMessageController.deleteMessage);
router.get('/contactmessages', contactMeMessageController.getAllMessages);

module.exports = router;
