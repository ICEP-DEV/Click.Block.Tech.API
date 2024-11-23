const NotificationService = require('../service/notificationService');

class NotificationController {
    static async processTransaction(req, res, next) {
        const { transactionId, custIdNr, pin } = req.body; // Extract only the needed fields

        
        try {
            // Fetch customer by ID
            const customer = await NotificationService.getCustomerById(custIdNr);
           
            
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            // Fetch transaction status to ensure it's not already processed
            const transaction = await NotificationService.getTransactionStatus(transactionId);
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // If the transaction is already approved, declined, or panic-triggered, block further processing
            if (['Approved', 'Declined', 'PanicTriggered'].includes(transaction.Status)) {
                return res.status(400).json({ error: 'Transaction has already been processed' });
            }

            

            // Check for matching PINs and determine the action
            if (pin === customer.LoginPin) {
                // If the PIN matches LoginPin, the action is "approve"
                const approved = await NotificationService.updateNotificationStatus(transactionId, 'Approved');
                res.status(200).json({ message: 'Logged in!', approved });                // Call next to proceed with the approval process
                return next();  // Proceed to the next middleware (approveTransaction)
            } else if (pin === customer.AlertPin) {
                // If the PIN matches AlertPin, the action is "triggerPanic"
                const panicResponse = await NotificationService.triggerPanicButton(custIdNr, transactionId);
                return res.status(200).json({ message: 'Insufficient! BALANCE IS R0,00.', panicResponse });
            } else {
                // If the PIN does not match either, decline the transaction
                // const notification = await NotificationService.updateNotificationStatus(transactionId, 'declined');

                return res.status(200).json({ message: 'Wrong Pin', incorrectPin});
            }

        } catch (error) {
            console.error('Error processing transaction:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    
}

module.exports = NotificationController;
