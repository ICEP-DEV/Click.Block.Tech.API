const db = require('../config/config');

class NotificationDao {
    // Update or insert notification status
    static updateNotificationStatus(transactionId, status) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Notification SET Status = ? WHERE TransactionID = ?`;

            db.query(query, [status, transactionId], (error, results) => {
                if (error) {
                    console.error('Database error during notification update:', error);  // Logging error
                    return reject(error);
                }

                if (results.affectedRows === 0) {
                    console.warn('No rows updated, trying to insert new notification');  // Log no rows updated
                    // If no rows were updated, insert a new notification
                    const insertQuery = `INSERT INTO Notification (TransactionID, Status, SentDate, NotificationType) VALUES (?, ?, NOW(), 'Withdrawal')`;
                    db.query(insertQuery, [transactionId, status], (insertError, insertResults) => {
                        if (insertError) {
                            console.error('Error inserting notification:', insertError);
                            return reject(insertError);
                        }
                        resolve({ message: 'New notification inserted with status ' + status });
                    });
                } else {
                    resolve({ message: 'Notification status updated to ' + status });
                }
            });
        });
    }
    

    // Get customer details by ID
    static getCustomerById(custIdNr) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Customer WHERE CustID_Nr = ?';
            db.query(query, [custIdNr], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null); // No customer found
                }
            });
        });
    }
}

module.exports = NotificationDao;
