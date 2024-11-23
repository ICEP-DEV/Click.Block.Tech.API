const AlertPinLogService = require('../service/alertPinLogService');

const logAlertPin = (req, res) => {
    const alertData = req.body;

    AlertPinLogService.logPin(alertData, (err, result) => {
        if (err) {
            console.error('Error logging alert pin:', err);
            return res.status(500).json({ error: 'Failed to log alert pin', message: err.message });
        }
        res.status(200).json(result);
    });
};

const getAllAlertPinLogs = (req, res) => {
    AlertPinLogService.fetchAllLogs((err, logs) => {
        if (err) {
            console.error('Error fetching alert pin logs:', err);
            return res.status(500).json({ error: 'Failed to fetch alert pin logs', message: err.message });
        }
        res.status(200).json(logs);
    });
};

module.exports = { logAlertPin, getAllAlertPinLogs };
