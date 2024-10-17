// routes/notificationRoutes.js
const express = require('express');
const NotificationController = require('../controllers/acceptOrDeclineController');


const router = express.Router();

router.get('/:transactionId', NotificationController.getNotifications);
router.post('/', NotificationController.createNotification);
router.post('/:transactionId/accept', NotificationController.acceptNotification);
router.post('/:transactionId/decline', NotificationController.declineNotification);
//router.post('/:transactionId/accept', NotificationController.validateNotificationStatus, NotificationController.acceptNotification);
//router.post('/:transactionId/decline', NotificationController.validateNotificationStatus, NotificationController.declineNotification);


module.exports = router;
