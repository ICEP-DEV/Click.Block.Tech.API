const TransactionService = require('../service/transactionService');
const NotificationService = require('../service/notificationService'); // Import NotificationService

class TransactionController {
  async processTransaction(req, res) {
    try {
      const { cardNumber, pin, transactionType, transactionAmount, locationID } = req.body;
      const result = await TransactionService.processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }



  async approveTransaction(req, res) {
    try {
      const { transactionId } = req.body;
      console.log('Received transactionId:', transactionId);

      // Get the notification status for the transaction
      const notificationStatus = await NotificationService.getNotificationStatus(transactionId);
      console.log('Notification status:', notificationStatus);

      if (notificationStatus === 'Approved') {
        const result = await TransactionService.approveTransaction(transactionId);
        console.log('Transaction approval result:', result);
        res.status(200).json(result);
      } else if (notificationStatus === 'Declined') {
        // Handle declined logic if needed
        res.status(200).json({ message: 'Transaction declined.' });
      } else {
        // Handle case if the status is neither 'Approved' nor 'Declined'
        res.status(400).json({ error: 'Invalid notification status for this transaction.' });
      }
    } catch (error) {
      console.error('Error in approving transaction:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getLatestPendingTransaction (req, res){
    const { custID_Nr } = req.params; // Assuming custID_Nr is passed as a parameter in the URL

    try {
        const transactionID = await TransactionService.getLatestPendingTransaction(custID_Nr);
        res.status(200).json({ transactionID });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
  
}

module.exports = new TransactionController();
