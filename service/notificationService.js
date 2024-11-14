const NotificationDao = require('../DAO/notificationDAO');

class NotificationService {
    // Approve a transaction by updating the notification status
    static async updateNotificationStatus(transactionId, status) {
        
        try {
            console.log(`Attempting to update notification status. Transaction ID: ${transactionId}, Status: ${status}`);
            
            const result = await NotificationDao.updateNotificationStatus(transactionId, status);
           
            if (result.affectedRows === 0) {
                console.error(`No notification found for Transaction ID: ${transactionId}`);
                throw new Error(`No notification found with ID ${transactionId}`);
            }

            console.log(`Notification status updated successfully for Transaction ID: ${transactionId}`);
            return result;
            
        } catch (error) {
            console.error(`Failed to update notification status for Transaction ID: ${transactionId}`, error);
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

            // Update the notification status to 'PanicTriggered'
            const notification = await NotificationDao.updateNotificationStatus(transactionId, 'PanicTriggered');
            
            return {
                message: 'Panic button triggered, transaction declined',
                transactionDecline,
                updateCustomerPanicStatus,
                notification
            };
        } catch (error) {
            console.error(`Failed to trigger panic button for Transaction ID: ${transactionId}`, error);
            throw error;
        }
    }

    // Get customer by ID
    static async getCustomerById(custIdNr) {
        try {
            console.log(`Fetching customer with ID: ${custIdNr}`);
            
            const customer = await NotificationDao.getCustomerById(custIdNr);
            if (!customer) {
                console.error(`Customer with ID ${custIdNr} not found`);
                throw new Error(`Customer not found with ID ${custIdNr}`);
            }

            console.log(`Customer retrieved successfully with ID: ${custIdNr}`);
            return customer;
        } catch (error) {
            console.error(`Failed to fetch customer with ID: ${custIdNr}`, error);
            throw error;
        }
    }

    // Get transaction status to check if already processed
    static async getTransactionStatus(transactionId) {
        try {
            const transaction = await NotificationDao.getTransactionStatus(transactionId);
            return transaction;
        } catch (error) {
            console.error(`Failed to fetch transaction status for Transaction ID: ${transactionId}`, error);
            throw error;
        }
    }
}

module.exports = NotificationService;
