// controllers/notificationController.js
const NotificationService = require('../service/acceptOrDeclineService');

class NotificationController {

    static async validateNotificationStatus(req, res, next) {
        const { transactionId } = req.params;

        try {
            const notifications = await NotificationService.getNotifications(transactionId);
            if (!notifications.length) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            if (notifications[0].status !== 'Pending') {
                return res.status(400).json({ error: `Notification already ${notifications[0].status}` });
            }
            next();
        } catch (error) {
            console.error('Error validating notification status:', error);
            res.status(500).json({ error: 'Server error during validation' });
        }
    }

    static async getNotifications(req, res) {
        const { transactionId } = req.params;

        console.log(`Fetching notifications for transactionId: ${transactionId}`);

        try {
            const notifications = await NotificationService.getNotifications(transactionId);
            if (!notifications.length) {
                return res.status(404).json({ error: 'No notifications found for this transaction' });
            }
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }

    static async createNotification(req, res) {
        const { transactionId, notificationType } = req.body;

        if (!transactionId || !notificationType) {
            return res.status(400).json({ error: 'transactionId and notificationType are required' });
        }

        try {
            const exists = await NotificationService.checkNotificationExists(transactionId);
            if (exists) {
                return res.status(409).json({ error: 'Notification already exists for this transaction' });
            }

            const notification = await NotificationService.createNotification(transactionId, notificationType);

            setTimeout(async () => {
                await NotificationService.declineNotification(transactionId);
                console.log(`Notification ${transactionId} automatically declined after 60 seconds`);
            }, 60000);

            res.status(201).json(notification);
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ error: 'Failed to create notification' });
        }
    }

    static async acceptNotification(req, res) {
        const { transactionId } = req.params;

        try {
            const notification = await NotificationService.acceptNotification(transactionId);
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found or already processed' });
            }
            res.status(200).json(notification);
        } catch (error) {
            console.error('Error accepting notification:', error);
            res.status(400).json({ error: 'Failed to accept notification' });
        }
    }

    static async declineNotification(req, res) {
        const { transactionId } = req.params;

        try {
            const notification = await NotificationService.declineNotification(transactionId);
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found or already processed' });
            }
            res.status(200).json(notification);
        } catch (error) {
            console.error('Error declining notification:', error);
            res.status(400).json({ error: 'Failed to decline notification' });
        }
    }
}

module.exports = NotificationController;
