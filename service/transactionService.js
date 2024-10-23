const transactionDAO = require('../DAO/transactionDAO'); // Import the DAO layer

class TransactionService {
    // Method to process the transaction
    async processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID) {
        try {
            // Step 1: Validate card number and PIN
            const customer = await transactionDAO.getCustomerByCardNumberAndPin(cardNumber, pin);
            if (!customer) {
                throw new Error('Invalid card number or PIN.');
            }

            // Step 2: Check account status (e.g., isActive)
            const account = await transactionDAO.getAccountByCustomerID(customer.CustID_Nr);
            if (!account || !account.isActive) {
                throw new Error('Account is not active.');
            }

            // Step 3: Process the transaction (e.g., update balance, insert transaction record)
            const transaction = await transactionDAO.createTransaction(account.AccountID, transactionType, transactionAmount, locationID);

            // Return the transaction details
            return transaction;

        } catch (error) {
            // Log the error for debugging
            console.error('Error in processTransaction:', error.message);
            throw new Error(`Transaction processing failed: ${error.message}`);
        }
    }
}

module.exports = new TransactionService(); // Export an instance of the service
