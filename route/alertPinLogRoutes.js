const express = require('express');
const { logAlertPin, getAllAlertPinLogs } = require('../controllers/alertPinLogController');

const router = express.Router();

// Logs a new pin usage : But since we are using the createAlert from the Alert Services this will be for testing.
router.post('/logAlertPin', logAlertPin); 

//Gets all logs
router.get('/alertPinLogs', getAllAlertPinLogs); 

module.exports = router;
