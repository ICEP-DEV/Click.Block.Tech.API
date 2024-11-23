const express = require('express');
const { logAlertPin, getAllAlertPinLogs } = require('../controllers/alertPinLogController');

const router = express.Router();

router.post('/logAlertPin', logAlertPin); // Logs a new pin usage
router.get('/alertPinLogs', getAllAlertPinLogs); // Retrieves all logs

module.exports = router;
