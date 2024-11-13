const NotificationService = require('../service/notificationService');

class NotificationController {
    // In NotificationController.js
    static async processTransaction(req, res) {
        const { transactionId, custIdNr, pin, action } = req.body; // action can be 'approve', 'triggerPanic', or 'decline'

        try {
            // Fetch customer by ID
            const customer = await NotificationService.getCustomerById(custIdNr);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            // Fetch transaction status to check if it's already processed
            const transaction = await NotificationService.getTransactionStatus(transactionId);
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // If the transaction is already approved, declined, or panic-triggered, block further processing
            if (['Approved', 'Declined', 'PanicTriggered'].includes(transaction.Status)) {
                return res.status(400).json({ error: 'Transaction has already been processed (approved, declined, or panic triggered)' });
            }

            // Process based on action (approve, triggerPanic, decline)
            if (action === 'approve') {
                if (pin === customer.LoginPin) {
                    // Approve the transaction and update notification status
                    const notification = await NotificationService.updateNotificationStatus(transactionId, 'Approved');

                    // Check if alert pin is also provided for panic trigger
                    if (req.body.alertPin && req.body.alertPin === customer.AlertPin) {
                        // Trigger panic button (decline the transaction and set PanicButtonStatus to 1)
                        const panicResponse = await NotificationService.triggerPanicButton(custIdNr, transactionId);
                        return res.status(200).json({ message: 'Panic button triggered! Transaction declined.', panicResponse });
                    }

                    return res.status(200).json({ message: 'Transaction approved successfully', notification });
                } else {
                    return res.status(400).json({ error: 'Invalid Login PIN' });
                }
            } else if (action === 'triggerPanic') {
                // Check the entered pin against the Alert PIN (panic trigger)
                if (pin === customer.AlertPin) {
                    // Trigger panic button (decline the transaction and set PanicButtonStatus to 1)
                    const panicResponse = await NotificationService.triggerPanicButton(custIdNr, transactionId);
                    return res.status(200).json({ message: 'Panic button triggered! Transaction declined.', panicResponse });
                } else {
                    return res.status(400).json({ error: 'Invalid Alert PIN' });
                }
            } else if (action === 'decline') {
                // Decline the transaction
                const notification = await NotificationService.updateNotificationStatus(transactionId, 'Declined');
                return res.status(200).json({ message: 'Transaction declined successfully', notification });
            } else {
                return res.status(400).json({ error: 'Invalid action' });
            }
        } catch (error) {
            console.error('Error processing transaction:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = NotificationController;
