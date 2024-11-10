const db = require('../config/config');

const AlertPinLogsDAO = {
    // Create an AlertPin log entry
    create: (logData, callback) => {
        const query = 'INSERT INTO AlertPinLogs (CustID_Nr, Action, TriggerDate) VALUES (?, ?, ?)';
        const params = [logData.CustID_Nr, logData.Action, logData.TriggerDate];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error inserting AlertPin log entry:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Monthly AlertPin usage count in desired format
    countAlertPinUsageByMonth: (custID, callback) => {
        const sql = `
            SELECT 
                YEAR(TriggerDate) AS year,
                MONTH(TriggerDate) AS month,
                COUNT(*) AS alert_pin_count
            FROM 
                AlertPinLogs
            WHERE 
                CustID_Nr = ? AND Action = 'alert'
            GROUP BY 
                YEAR(TriggerDate), MONTH(TriggerDate)
            ORDER BY 
                year, month;
        `;
        
        db.query(sql, [custID], (err, results) => {
            if (err) {
                console.error('Error counting alert pin usage:', err);
                return callback(err);
            }
            // Format the results to include "year", "month", and "alert_pin_count" as requested
            const formattedResults = results.map(row => ({
                year: row.year,
                month: row.month,
                alert_pin_count: row.alert_pin_count
            }));
            callback(null, formattedResults);
        });
    },

    // Total AlertPin usage count
    countTotalUsageByCustomerId: (custID, callback) => {
        const sql = `
            SELECT COUNT(*) AS total_usage_count 
            FROM AlertPinLogs 
            WHERE CustID_Nr = ? AND Action = 'alert';
        `;
        db.query(sql, [custID], (err, results) => {
            if (err) {
                console.error('Error counting total alert pin usage:', err);
                return callback(err);
            }
            callback(null, results[0].total_usage_count);
        });
    }
};

module.exports = AlertPinLogsDAO;
