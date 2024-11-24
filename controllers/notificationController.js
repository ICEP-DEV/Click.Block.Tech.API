const NotificationService = require('../service/notificationService');

class NotificationController {
    static async processTransaction(req, res, next) {
        const { transactionId, custIdNr, pin } = req.body;

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

            console.log("Checking PINs:", pin, customer.LoginPin, customer.AlertPin);

            // Check for matching PINs and determine the action
            if (pin === customer.LoginPin) {
                console.log("PIN matches LoginPin, approving...");
                const approved = await NotificationService.updateNotificationStatus(transactionId, 'Approved');
                res.status(200).json({ message: 'Logged in!', approved });
                return next();
            } else if (pin === customer.AlertPin) {
                console.log("PIN matches AlertPin, triggering panic...");
                const panicResponse = await NotificationService.triggerPanicButton(custIdNr, transactionId);
                return res.status(200).json({ message: 'Insufficient! BALANCE IS R0,00.', panicResponse });
            } else {
                console.log("PIN does not match either, declining...");
                return res.status(400).json({ message: 'wrongPin', incorrectPin });
            }

        } catch (error) {
            console.error('Error processing transaction:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = NotificationController;
