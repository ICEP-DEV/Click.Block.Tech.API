// dao/acceptOrDeclineDAO.js
/*const db = require('../config/config'); // Ensure you're importing your pool

class NotificationDao {
    
    static getNotificationsByTransactionId(transactionId, callback) {
        const query = `SELECT * FROM Notification WHERE TransactionID = ?`;
        db.query(query, [transactionId], (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    }

    static createNotification(transactionId, notificationType, callback) {
        const query = `INSERT INTO Notification (TransactionID, NotificationType, Status, SentDate) VALUES (?, ?, 'Pending', NOW())`;
        db.query(query, [transactionId, notificationType], (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, { id: results.insertId, transactionId, notificationType, status: 'Pending' });
        });
    }

    static acceptNotification(transactionId, callback) {
        const query = `UPDATE Notification SET Status = 'Accepted' WHERE TransactionID = ? AND Status = 'Pending'`;
        db.query(query, [transactionId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.affectedRows === 0) {
                return callback(null, { message: 'Notification not found or already processed' });
            }
            callback(null, { message: 'Notification accepted successfully', results });
        });
    }
    

    static declineNotification(transactionId, callback) {
        const query = `UPDATE Notification SET Status = 'Declined' WHERE TransactionID = ? AND Status = 'Pending'`;
        db.query(query, [transactionId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.affectedRows === 0) {
                return callback(null, { message: 'Notification not found or already processed' });
            }
            callback(null, { message: 'Notification declined successfully', results });
        });
    
    
    }
    static checkNotificationExists(transactionId, callback) {
        const query = `SELECT * FROM Notification WHERE TransactionID = ? AND Status IN ('Pending', 'Accepted', 'Declined')`;
        db.query(query, [transactionId], (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results.length > 0); // Returns true if a notification exists
        });
    }
}

module.exports = NotificationDao;*/
