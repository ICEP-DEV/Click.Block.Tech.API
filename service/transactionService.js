const NotificationService = require('../service/notificationService');
const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const Transaction = require('../models/transaction');

class TransactionService {
  // Attempt to create a transaction that requires approval
  async processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID) {
    return new Promise((resolve, reject) => {
      TransactionDAO.getCustomerByCardNumber(cardNumber, (err, customer) => {
        if (err) return reject(new Error('Error fetching customer.'));
        if (!customer) return reject(new Error('Customer not found.'));

        TransactionDAO.verifyPin(customer.CustID_Nr, pin, (err, isPinValid) => {
          if (err) return reject(new Error('Error verifying PIN.'));
          if (!isPinValid) return reject(new Error('Invalid PIN.'));

          const validTransactionTypes = ['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'];
          const status = validTransactionTypes.includes(transactionType) ? 'Pending' : 'Completed';

          if (status === 'Completed') {
            // If the transaction does not require approval, directly update the balance and save it
            this.updateBankAccountBalance(customer.AccountID, transactionType, transactionAmount, (err) => {
              if (err) return reject(new Error('Error updating bank account balance.'));

              const transaction = new Transaction(
                null,
                customer.AccountID,
                transactionType,
                new Date(),
                transactionAmount,
                'Completed',
                false,
                null
              );
              TransactionDAO.createTransaction(transaction, (err, transactionID) => {
                if (err) return reject(new Error('Error creating transaction.'));
                resolve({ transactionID, message: 'Transaction completed successfully' });
              });
            });
          } else {
            // If the transaction requires approval, hold off on saving it until approved
            const pendingTransaction = new Transaction(
              null,
              customer.AccountID,
              transactionType,
              new Date(),
              transactionAmount,
              'Pending',
              false,
              null
            );

            // Save the pending transaction to the database and retrieve its ID
            TransactionDAO.createPendingTransaction(pendingTransaction, (err, transactionID) => {
              if (err) return reject(new Error('Error saving pending transaction.'));
              resolve({ transactionID, message: 'Transaction created and awaiting approval' });
            });
          }
        });
      });
    });
  }

  approveTransaction(transactionID, callback) {
    console.log("INPUT TRANSACTION ID:", transactionID);
  
    if (!transactionID) {
      const error = new Error('Transaction ID is required');
      console.error(error);
      return callback(error, null);
    }
  
    TransactionDAO.getTransactionById(transactionID, (err, transaction) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            return callback(err, null);
        }
        
        console.log('Fetched transaction:', transaction);
  
        if (!transaction) {
          const error = new Error(`Transaction with ID ${transactionID} not found.`);
          console.error(error);
          return callback(error, null);
        }
    
        if (transaction.Status === 'Completed' || transaction.Status === 'Cancelled') {
          const error = new Error('Transaction has already been completed or cancelled');
          console.error(error);
          return callback(error, null);
        }

        // Proceed with the approval process
        console.log('Attempting to update notification status...');
        NotificationService.updateNotificationStatus(transactionID, 'Approved')
            .then(() => {
                console.log("Notification status updated to 'Approved' for transaction ID:", transactionID);
                
                const withdrawalTypes = ['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'];
                if (withdrawalTypes.includes(transaction.TransactionType)) {
                    console.log(`Updating balance for transaction type: ${transaction.TransactionType}, Amount: ${transaction.TransactionAmount}`);
                    
                    this.updateBankAccountBalance(transaction.AccountID, transaction.TransactionType, transaction.TransactionAmount, (err) => {
                        if (err) return callback(err, null);
                        
                        // Update transaction status to 'Completed'
                        TransactionDAO.updateTransactionStatus(transactionID, 'Completed', (err, result) => {
                            if (err) {
                                console.error('Error updating transaction status:', err);
                                return callback(err, null);
                            }
                            if (result.affectedRows === 0) {
                                console.error(`No transaction found with ID ${transactionID}`);
                                return callback(new Error(`No transaction found with ID ${transactionID}`));
                            }
                            console.log('Transaction status updated to Completed');

                            if(callback){
                              callback(null, { message: 'Transaction approved, processed, and saved to the database', transactionID });
                           }
                          });
                    });
                } else {
                    // If it's not a withdrawal type, directly update status to 'Completed'
                    TransactionDAO.updateTransactionStatus(transactionID, 'Completed', (err, result) => {
                        if (err) {
                            console.error('Transaction status update failed:', err);
                            return callback(err, null);
                        }
                        if (result.affectedRows === 0) {
                            console.error(`No transaction found with ID ${transactionID}`);
                            return callback(new Error(`No transaction found with ID ${transactionID}`));
                        }
                        console.log('Transaction status updated to Completed');
                        callback(null, { message: 'Transaction approved and completed', transactionID });
                    });
                }
            })
            .catch((err) => {
                console.error('Error in updating notification status:', err);
                return callback(err, null);
            });
    });
}

  

  // Update bank account balance
  updateBankAccountBalance(accountID, transactionType, transactionAmount, callback) {
    console.log('Updating balance for account:', accountID);
    
    BankAccountDAO.getById(accountID, (err, bankAccount) => {
      if (err) {
        console.error('Error fetching bank account:', err);
        return callback(new Error('Failed to retrieve bank account.'));
      }
      if (!bankAccount) {
        console.error('Bank account not found for ID:', accountID);
        return callback(new Error('Bank account not found.'));
      }

      let newBalance = bankAccount.Balance;
      console.log('Current balance:', newBalance);

      if (['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'].includes(transactionType)) {
        newBalance -= transactionAmount;
      } else {
        newBalance += transactionAmount;
      }

      console.log(`New balance for account ${accountID}: ${newBalance}`);

      BankAccountDAO.update(accountID, { Balance: newBalance }, (err, result) => {
        if (err) {
          console.error('Error updating bank account balance:', err);
          return callback(new Error('Failed to update bank account balance.'));
        }

        console.log('Balance updated successfully in database');
        callback(null);
      });
    });
  }
}

module.exports = new TransactionService();
