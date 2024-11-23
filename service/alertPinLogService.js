const AlertPinLogDAO = require('../DAO/alertPinLogDAO');

const AlertPinLogService = {
    logPin: (alertData, callback) => {
        const { CustID_Nr, Action } = alertData;

        AlertPinLogDAO.logPinUsage(CustID_Nr, Action || 'Alert Triggered', (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    },

    fetchAllLogs: (callback) => {
        AlertPinLogDAO.getAllPinLogs((err, logs) => {
            if (err) {
                return callback(err);
            }
            callback(null, logs);
        });
    }
};

module.exports = AlertPinLogService;
