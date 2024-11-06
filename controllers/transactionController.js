const TransactionService = require('../service/transactionService');

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
      const { transactionId, action } = req.body;
      console.log('Received transactionId:', transactionId, 'with action:', action);
      
      if (action !== 'approve' && action !== 'decline') {
        return res.status(400).json({ error: 'Invalid action. Must be "approve" or "decline".' });
      }
  
      if (action === 'approve') {
        const result = await TransactionService.approveTransaction(transactionId);
        console.log('Transaction approval result:', result);
        res.status(200).json(result);
      } else {
        // Handle decline logic if necessary
        res.status(200).json({ message: 'Transaction declined.' });
      }
    } catch (error) {
      console.error('Error in approving transaction:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
  
}

module.exports = new TransactionController();
