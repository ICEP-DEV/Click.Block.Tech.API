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

    // Trigger panic button (decline the transaction and mark as panic-triggered)
    static async triggerPanicButton(custIdNr, transactionId) {
        try {
            console.log(`Triggering panic button for Customer ID: ${custIdNr}, Transaction ID: ${transactionId}`);
            
            const result = await NotificationDao.updateNotificationStatus(transactionId, 'Declined');
            
            if (result.affectedRows === 0) {
                console.error(`No notification found to decline for Transaction ID: ${transactionId}`);
                throw new Error(`No notification found with ID ${transactionId}`);
            }

            console.log(`Panic button triggered, transaction declined for Transaction ID: ${transactionId}`);
            return { message: 'Panic button triggered, transaction declined', result };
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
}

module.exports = NotificationService;
