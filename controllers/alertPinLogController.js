const AlertPinLogService = require('../service/alertPinLogService');

const AlertPinLogController = {
    // Get monthly AlertPin usage count
    countAlertPinUsageByMonth: (req, res) => {
        const custID = req.params.custID;

        AlertPinLogService.getMonthlyUsageCount(custID, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving monthly AlertPin usage count', error: err });
            }
            // Format the data to include month names for frontend compatibility
            const formattedResults = results.map(record => ({
                year: record.year,
                month: new Date(record.year, record.month - 1 , record.day).toLocaleString('default', { month: 'short' }),
                count: record.alert_pin_count
            }));
            res.json(formattedResults);
        });
    },

    // Get total AlertPin usage count
    countUsageByCustomerId: (req, res) => {
        const custID = req.params.custID;

        AlertPinLogService.getTotalUsageCount(custID, (err, count) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving total AlertPin usage count', error: err });
            }
            res.json({ usageCount: count });
        });
    },
    // Get AlertPin logs for all customers grouped by year and month
    getAllCustomerAlertPinLogs: (req, res) => {
        AlertPinLogService.getUsageByAllCustomers((err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving AlertPin logs for all customers', error: err });
            }
            res.json(results);
        });
    }
};

module.exports = AlertPinLogController;
