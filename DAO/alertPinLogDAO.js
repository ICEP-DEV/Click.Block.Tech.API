const db = require('../config/config');

const AlertPinLogDAO = {
    logPinUsage: (custID, action, callback) => {
        const insertSql = `
            INSERT INTO alertpinlogs (CustID_Nr, TriggerDate, Action) 
            VALUES (?, NOW(), ?)
        `;
        db.query(insertSql, [custID, action], (err, result) => {
            if (err) {
                return callback(new Error('Failed to insert AlertPinLog: ' + err.message));
            }
            callback(null, { message: 'Pin usage logged', inserted: true });
        });
    },

    getAllPinLogs: (callback) => {
        const sql = `
            SELECT 
                CustID_Nr AS "Id Number",
                YEAR(TriggerDate) AS "year",
                DATE_FORMAT(TriggerDate, '%d %b') AS "date",
                COUNT(*) AS "count"
            FROM alertpinlogs
            GROUP BY CustID_Nr, YEAR(TriggerDate), DATE_FORMAT(TriggerDate, '%Y-%m-%d')
        `;
        db.query(sql, (err, results) => {
            if (err) {
                return callback(new Error('Failed to fetch AlertPinLogs: ' + err.message));
            }
            callback(null, results);
        });
    }
};

module.exports = AlertPinLogDAO;
