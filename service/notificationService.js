const NotificationDao = require('../DAO/notificationDAO');

class NotificationService {
    // Approve a transaction by updating the notification status
    static async updateNotificationStatus(transactionId, status) {
        try {
            const notification = await NotificationDao.updateNotificationStatus(transactionId, status);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // Trigger panic button (decline the transaction and mark as panic-triggered)
    static async triggerPanicButton(custIdNr, transactionId) {
        try {
            const notification = await NotificationDao.updateNotificationStatus(transactionId, 'Declined');
            // You can add additional logic here to handle panic-triggered actions if necessary
            return { message: 'Panic button triggered, transaction declined', notification };
        } catch (error) {
            throw error;
        }
    }

    // Get customer by ID
    static async getCustomerById(custIdNr) {
        try {
            const customer = await NotificationDao.getCustomerById(custIdNr);
            return customer;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotificationService;
