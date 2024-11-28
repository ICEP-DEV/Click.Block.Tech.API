const NotificationService = require('../service/notificationService');
const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const NotificationDAO = require('../DAO/notificationDAO');
const Transaction = require('../models/transaction');
const Notification = require('../models/notification');

class TransactionService {
  // This function create a pending transaction that will wait for approval
  createTransaction(transactionType, transactionAmount, status, date, accountID, callback) {
      TransactionDAO.getBankAccountById(accountID, (err, bankAccount) => {
        if(err){
          console.error('Error fetching customer:', err);
          return callback({ status: 500, message: 'Failed to fetch customer' });
        }
        if (!bankAccount) return callback(new Error('Account Number is required'));
          // Checking if the bank account is active 
          if (bankAccount.isActive === 0) {
            const transactionID = -1;
            return callback({ transactionID, message: 'Transaction cannot proceed as account is disabled.' });
          }
          //const validTransactionTypes = ['CashTransfer', 'EFT', 'OnlinePurchase', 'CashPayment', 'PaymentOrder'];
          //const status = validTransactionTypes.includes(transactionType) ? 'Pending' : 'Completed';
          const pendingTransaction = new Transaction(
            null,
            accountID,
            transactionType,
            date,
            transactionAmount,
            status,
            0
          );
           

          // Save the pending transaction to the database and retrieve its ID
          TransactionDAO.createPendingTransaction(pendingTransaction, (err, transactionID) => {
            if (err) return callback(new Error('Error saving pending transaction.'));
            return callback({ transactionID, message: 'Transaction created and awaiting approval' });
          });
      
      });
  }
  getTransactionByAccID(accountID,transStatus, callback){
    if(!accountID || !transStatus){
      const error = new Error('Account ID is required');
      return callback(error, null);
    }
    TransactionDAO.getAllTransactionsByAccountID(accountID,transStatus, (err, transactions) => {
      if(err){
        console.error('Error fetching transactions:', err);
        return callback(err, null);
      }
      return callback(transactions);
    });
  }
  
  
  // Update bank account balance
  getBankAccount(accountID, callback) {
    
    BankAccountDAO.getById(accountID, (err, bankAccount) => {
      if (err) {
        console.error('Error fetching bank account:', err);
        return callback(new Error('Failed to retrieve bank account.'));
      }
      if (!bankAccount) {
        console.error('Bank account not found for ID:', accountID);
        return callback(new Error('Bank account not found.'));
      }
      return callback(bankAccount);
        
     
    });

    
  }

  updateTransactionStatus(transactionID,status, callback){
    TransactionDAO.updateTransactionStatus(status, transactionID, (err, result)=>{
      if(err){
        console.error('updating status:', err);
        return callback(new Error('Failed to update transaction status.'));
      }
      
    })
  }
}

module.exports = new TransactionService();
