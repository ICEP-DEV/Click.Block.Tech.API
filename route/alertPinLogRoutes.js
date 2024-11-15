// routes/alertPinLogRoutes.js

const express = require('express');
const router = express.Router();
const AlertPinLogController = require('../controllers/alertPinLogController');

// Endpoint to get AlertPin usage count by month and year
router.get('/:custID/monthlyUsage', AlertPinLogController.countAlertPinUsageByMonth);

// Endpoint to get total AlertPin usage count
router.get('/:custID/totalUsage', AlertPinLogController.countUsageByCustomerId);

// Endpoint to get AlertPin logs for all customers
router.get('/allCustomers/logs', AlertPinLogController.getAllCustomerAlertPinLogs);

module.exports = router;
