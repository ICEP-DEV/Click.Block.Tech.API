const express = require('express');
const NotificationController = require('../controllers/notificationController'); // Check this path

const router = express.Router();

// Define your route and use the controller method
router.post('/process-transaction', NotificationController.processTransaction);

module.exports = router; // Ensure you're exporting the router correctly