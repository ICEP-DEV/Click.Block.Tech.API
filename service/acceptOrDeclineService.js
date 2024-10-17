const NotificationDao = require('../DAO/acceptOrDeclineDAO');


class NotificationService {
    static async getNotifications(transactionId) {
        return new Promise((resolve, reject) => {
            NotificationDao.getNotificationsByTransactionId(transactionId, (error, notifications) => {
                if (error) {
                    console.error('Error fetching notifications from DAO:', error);
                    return reject(error);
                }
                resolve(notifications);
            });
        });
    }

    static async createNotification(transactionId, notificationType) {
        return new Promise((resolve, reject) => {
            NotificationDao.createNotification(transactionId, notificationType, (error, result) => {
                if (error) {
                    console.error('Error creating notification in DAO:', error);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }


    static async acceptNotification(transactionId) {
        return new Promise((resolve, reject) => {
            NotificationDao.acceptNotification(transactionId, (error, result) => {
                if (error) {
                    console.error('Error accepting notification in DAO:', error);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    static async declineNotification(transactionId) {
        return new Promise((resolve, reject) => {
            NotificationDao.declineNotification(transactionId, (error, result) => {
                if (error) {
                    console.error('Error declining notification in DAO:', error);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
    static async checkNotificationExists(transactionId) {
        return new Promise((resolve, reject) => {
            NotificationDao.checkNotificationExists(transactionId, (error, exists) => {
                if (error) {
                    console.error('Error checking notification existence in DAO:', error);
                    return reject(error);
                }
                resolve(exists);
            });
        });
    }
}

module.exports = NotificationService;
