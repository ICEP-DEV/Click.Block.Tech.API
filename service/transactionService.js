const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO'); // Using this DAO for bank account operations
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

          // Step 3: Validate transaction type before proceeding
          const validTransactionTypes = ['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'];
          if (!validTransactionTypes.includes(transactionType)) {
            return reject(new Error('Unknown transaction type, transaction aborted.'));
          }

          // Step 4: Create Transaction
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

            console.log(`Transaction created with ID: ${transactionID}`);
            console.log(`AccountID: ${customer.AccountID}, TransactionType: ${transactionType}, Amount: ${transactionAmount}`);

            // Step 5: Update bank account balance based on transaction type
            this.updateBankAccountBalance(customer.AccountID, transactionType, transactionAmount)
              .then(() => {
                resolve(transactionID); // Return transaction ID after successful balance update
              })
              .catch((err) => {
                console.error('Error updating bank account balance:', err);
                return reject(new Error('Error updating bank account balance.'));
              });
          });
        });
      });
    });
  }

  async updateBankAccountBalance(accountID, transactionType, transactionAmount) {
    try {
      console.log(`Fetching account balance for AccountID: ${accountID}`);

      // Fetch the current bank account
      BankAccountDAO.getById(accountID, (err, bankAccount) => {
        if (err) {
          throw new Error('Failed to retrieve bank account: ' + err.message);
        }

        if (!bankAccount) {
          throw new Error('Bank account not found');
        }

        console.log(`Current balance: ${bankAccount.Balance}`);

        let newBalance = bankAccount.Balance;

        // Adjust balance based on transaction type
        switch (transactionType) {
          case 'Cash Transfer':
          case 'EFT':
          case 'Online Purchase':
          case 'Cash Payment':
          case 'Payment Order':
            newBalance -= transactionAmount;
            break;
          default:
            throw new Error('Unknown transaction type, no balance update should happen.');
        }

        console.log(`New balance after ${transactionType}: ${newBalance}`);

        // Update the bank account with the new balance
        const updateData = { Balance: newBalance };
        BankAccountDAO.update(accountID, updateData, (err, result) => {
          if (err) {
            throw new Error('Failed to update bank account: ' + err.message);
          }

          if (result) {
            console.log('Bank account balance updated successfully');
          } else {
            throw new Error('Bank account balance update failed');
          }
        });
      });
    } catch (err) {
      console.error('Error in updateBankAccountBalance:', err);
      throw err;
    }
  }
}

module.exports = new TransactionService();
