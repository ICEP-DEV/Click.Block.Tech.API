const express = require('express');
const NotificationController = require('../controllers/notificationController'); // Check this path
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// Define your route and use the controller method
router.post('/process-transaction', NotificationController.processTransaction, transactionController.approveTransaction);
router.get('/transactions/:transactionId', NotificationController.getTransactionStatus);

module.exports = router; 