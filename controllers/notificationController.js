const NotificationService = require('../service/notificationService');

class NotificationController {
    static async processTransaction(req, res) {
        const { transactionId, custIdNr, pin, action } = req.body; // `action` can be 'approve' or 'decline'

        try {
            // Fetch customer by ID
            const customer = await NotificationService.getCustomerById(custIdNr);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            // Process based on action (approve or decline)
            if (action === 'approve') {
                if (pin === customer.LoginPin) {
                    // Approve the transaction and update the notification status
                    const notification = await NotificationService.updateNotificationStatus(transactionId, 'Accepted');
                    return res.status(200).json({ message: 'Transaction approved successfully', notification });
                } else if (pin === customer.AlertPin) {
                    // Trigger panic button and decline transaction
                    const panicResponse = await NotificationService.triggerPanicButton(custIdNr, transactionId);
                    return res.status(200).json({ message: 'Panic button triggered! Transaction declined.', panicResponse });
                } else {
                    return res.status(400).json({ error: 'Invalid PIN' });
                }
            } else if (action === 'decline') {
                // Decline transaction and update notification status
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
