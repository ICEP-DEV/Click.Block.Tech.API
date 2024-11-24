const TransactionService = require('../service/transactionService');
const NotificationService = require('../service/notificationService'); // Import NotificationService

class TransactionController {
  // Process the transaction, whether it requires approval or not
  async processTransaction(req, res) {
    try {
      const { cardNumber, pin, transactionType, transactionAmount, locationID } = req.body;
      const result = await TransactionService.processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID);
      res.status(200).json(result); // Send the response with the result
    } catch (error) {
      res.status(400).json({ error: error.message }); // Handle errors with appropriate message
    }
  }

  // Approve a pending transaction after checking its notification status
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
        res.status(200).json(result); // Return the approval result
      } else if (notificationStatus === 'Declined') {
        res.status(200).json({ message: 'Transaction declined.' });
      } else {
        res.status(400).json({ error: 'Invalid notification status for this transaction.' });
      }
    } catch (error) {
      console.error('Error in approving transaction:', error.message);
      res.status(400).json({ error: error.message }); // Return error in case of failure
    }
  }

 // Get the latest pending transaction for a customer
getLatestPendingTransaction(req, res) {
  const { custID_Nr } = req.params; // Extract custID_Nr from the URL parameters

  // Validate custID_Nr
  if (!custID_Nr) {
    return res.status(400).json({ error: 'Customer ID is required.' });
  }

  // Fetch the latest pending transaction ID using Promises
  TransactionService.getLatestPendingTransaction(custID_Nr)
    .then(transactionID => {
      // Check if a valid transactionID was found
      if (!transactionID) {
        return res.status(404).json({ error: 'No pending transaction found for this customer.' });
      }

      // Return the transaction ID
      res.status(200).json({ transactionID });
    })
    .catch(error => {
      console.error('Error fetching latest pending transaction:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred.' }); // Return server error
    });
}

}

module.exports = new TransactionController();
