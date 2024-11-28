const db = require('../config/config');
const Notification = require('../models/notification');

const NotificationDAO = {
    createNotification: (notificationData, callback) => {
        const sql = 'INSERT INTO notification SET ?';
    
        db.query(sql, notificationData, (err, result) => {
          if (err) {
            return callback({ status: 500, message: 'Database error' });
          }
        });
      },
    
    getNotificationsByStatus: (status, callback) => {
        const sql = 'SELECT * FROM notification WHERE Status = ?';
        db.query(sql,status, (err, results) => {
            if (err) {
              return callback({ status: 500, message: 'Database error' });
            }
            
            const notification = results.map(result => new Notification(
                result.NotificationID,
                result.TransactionID,
                result.NotificationType,
                result.SentDate,
                result.Status
              ));
              callback(null, notification);
          });
    },
    
    updateNotificationStatus: (status,transactionId, callback = () => {}) => {
      
      const query = 'UPDATE notification SET Status = ? WHERE TransactionID = ?';
  
      db.query(query, [status, transactionId], (err, result) => {
        if (err) {
          console.error('Error updating notification status:', err);
          return callback({ status: 500, message: 'Database error' });
        }
  
        console.log("Notification status updated successfully:", result);
        callback(null, result.affectedRows); // Return the number of affected rows
      });
    },
}  

module.exports = NotificationDAO;
