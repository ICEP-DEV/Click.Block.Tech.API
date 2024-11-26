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
    }
}  

module.exports = NotificationDAO;
