const express = require('express');
const NotificationController = require('../controllers/notificationController'); // Check this path

const router = express.Router();

// Define your route and use the controller method
router.post('/create_notification', NotificationController.createNotification);
router.get('/getNotified_ByStatus/:status', NotificationController.getNotificationByStatus);

module.exports = router; 