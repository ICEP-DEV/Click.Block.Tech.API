const TransactionDAO = require('../DAO/transactionDAO');
const Transaction = require('../models/transaction'); // Assuming a Transaction model exists

class TransactionService {
  async processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID) {
    return new Promise((resolve, reject) => {
      // Step 1: Get Customer by Card Number
      TransactionDAO.getCustomerByCardNumber(cardNumber, (err, customer) => {
        if (err) {
          return reject(new Error('Error fetching customer.'));
        }
        
        if (!customer) {
          return reject(new Error('Customer not found.'));
        }

        // Step 2: Verify PIN
        TransactionDAO.verifyPin(customer.CustID_Nr, pin, (err, isPinValid) => {
          if (err) {
            return reject(new Error('Error verifying PIN.'));
          }

          if (!isPinValid) {
            return reject(new Error('Invalid PIN.'));
          }

          // Step 3: Create Transaction
          const transaction = new Transaction(
            null, // TransactionID will be auto-generated
            customer.AccountID,
            transactionType,
            new Date(),
            transactionAmount,
            'Pending', // Initial status of transaction
            false, // Default for isFraud
            null  // AdminUserID for review (optional)
          );

          TransactionDAO.createTransaction(transaction, (err, transactionID) => {
            if (err) {
              return reject(new Error('Error creating transaction.'));
            }

            // Successfully created the transaction, resolve with transaction ID
            resolve(transactionID);
          });
        });
      });
    });
  }
}

module.exports = new TransactionService();