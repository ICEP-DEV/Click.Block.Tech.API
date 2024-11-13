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

    // Trigger panic button (decline the transaction and mark the panic-triggered)
    static async triggerPanicButton(custIdNr, transactionId) {
        try {
            // Check if the transaction is already processed before proceeding
            const transaction = await NotificationDao.getTransactionStatus(transactionId);
            if (transaction && ['Approved', 'Declined', 'PanicTriggered'].includes(transaction.Status)) {
                throw new Error('Transaction has already been processed (cannot trigger panic again)');
            }

            // Decline the transaction and set panic-triggered status
            const transactionDecline = await NotificationDao.declineTransaction(transactionId);
            const updateCustomerPanicStatus = await NotificationDao.updateCustomerPanicStatus(custIdNr);

            // Update the notification status to 'Declined'
            const notification = await NotificationDao.updateNotificationStatus(transactionId, 'PanicTriggered');
            
            return {
                message: 'Panic button triggered, transaction declined',
                transactionDecline,
                updateCustomerPanicStatus,
                notification
            };
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

    // Get transaction status to check if already processed
    static async getTransactionStatus(transactionId) {
        try {
            const transaction = await NotificationDao.getTransactionStatus(transactionId);
            return transaction;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NotificationService;
