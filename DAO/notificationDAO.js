const db = require('../config/config');

class NotificationDao {
    // Update or insert notification status
    static updateNotificationStatus(transactionId, status) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Notification SET Status = ? WHERE TransactionID = ?`;

            db.query(query, [status, transactionId], (error, results) => {
                if (error) {
                    console.error('Database error during notification update:', error);
                    return reject(error);
                }

                if (results.affectedRows === 0) {
                    console.warn('No rows updated, trying to insert new notification');
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

    // Get the status of a notification by TransactionID
    static getNotificationStatus(transactionId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT Status FROM Notification WHERE TransactionID = ?';
            db.query(query, [transactionId], (error, results) => {
                if (error) {
                    console.error('Error fetching notification status:', error);
                    return reject(error);
                }
                if (results.length > 0) {
                    resolve(results[0].Status); // Return the status
                } else {
                    resolve(null); // No status found for this transaction
                }
            });
        });
    }

    static declineTransaction(transactionId) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Transaction SET Status = 'Declined', IsPanicTrigered = 1 WHERE TransactionID = ?`;
    
            db.query(query, [transactionId], (error, results) => {
                if (error) {
                    console.error('Error declining transaction:', error);
                    return reject(error);
                }
    
                if (results.affectedRows === 0) {
                    console.warn('No rows updated for TransactionID:', transactionId);
                    return reject(new Error('Transaction not found or already processed'));
                }
    
                resolve({ message: 'Transaction declined and panic triggered' });
            });
        });
    }

    // Update PanicButtonStatus for the customer
    static updateCustomerPanicStatus(custIdNr) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Customer SET PanicButtonStatus = 1 WHERE CustID_Nr = ?`;

            db.query(query, [custIdNr], (error, results) => {
                if (error) {
                    console.error('Error updating PanicButtonStatus:', error);
                    return reject(error);
                }
                resolve({ message: 'PanicButtonStatus updated to 1 for customer' });
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

    // Get transaction status by TransactionID
    static getTransactionStatus(transactionId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Transaction WHERE TransactionID = ?';
            db.query(query, [transactionId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }
}

module.exports = NotificationDao;
