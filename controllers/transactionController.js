const TransactionService = require('../service/transactionService');

class TransactionController {
    async handleTransaction(req, res) {
        try {
            const { CardNumber, Pin, TransactionType, TransactionAmount } = req.body;
            
            const transactionID = await TransactionService.processTransaction(CardNumber, Pin, TransactionType, TransactionAmount);
            res.status(201).json({ message: 'Transaction processed successfully', transactionID });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new TransactionController();
