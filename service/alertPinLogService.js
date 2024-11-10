const AlertPinLogsDAO = require('../DAO/alertPinLogDAO');

const AlertPinLogService = {
    // Create a log entry for AlertPin usage
    createAlertPinLog: (custID, action, callback) => {
        const logData = {
            CustID_Nr: custID,
            Action: action,
            TriggerDate: new Date()
        };

        AlertPinLogsDAO.create(logData, (err, result) => {
            if (err) {
                console.error('Failed to create AlertPin log entry:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Count monthly AlertPin usage for a specific customer
    getMonthlyUsageCount: (custID, callback) => {
        AlertPinLogsDAO.countAlertPinUsageByMonth(custID, (err, results) => {
            if (err) {
                console.error('Error retrieving monthly usage count:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Count total AlertPin usage for a specific customer
    getTotalUsageCount: (custID, callback) => {
        AlertPinLogsDAO.countTotalUsageByCustomerId(custID, (err, count) => {
            if (err) {
                console.error('Error retrieving total usage count:', err);
                return callback(err);
            }
            callback(null, count);
        });
    }
};

module.exports = AlertPinLogService;
