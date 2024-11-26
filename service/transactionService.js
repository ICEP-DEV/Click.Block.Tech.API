const NotificationService = require('../service/notificationService');
const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const NotificationDAO = require('../DAO/notificationDAO');
const Transaction = require('../models/transaction');
const Notification = require('../models/notification');

class TransactionService {
  // This function create a pending transaction that will wait for approval
  processTransaction(cardNumber, transactionType, transactionAmount, status, date, callback) {
      TransactionDAO.getCustomerByCardNumber(cardNumber, (err, customer) => {
        if(err){
          console.error('Error fetching customer:', err);
          return callback({ status: 500, message: 'Failed to fetch customer' });
        }
        if (!customer) return callback(new Error('Account Number is required'));
    
          // Check if panic is triggered
          if (customer.PanicButtonStatus === 1) {
            return callback(new Error('Transaction cannot proceed as account is disabled.'));
          }
          //const validTransactionTypes = ['CashTransfer', 'EFT', 'OnlinePurchase', 'CashPayment', 'PaymentOrder'];
          //const status = validTransactionTypes.includes(transactionType) ? 'Pending' : 'Completed';
          const pendingTransaction = new Transaction(
            null,
            customer.AccountID,
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
                
                const withdrawalTypes = ['CashTransfer', 'EFT', 'OnlinePurchase', 'CashPayment', 'PaymentOrder'];
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
  updateBankAccountBalance(accountID, transactionAmount, callback) {
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

      let oldBalance = bankAccount.Balance;
      let newBalance = 0.0;
      console.log('Current balance:', newBalance);

       
    
      console.log(`New balance for account ${accountID}: ${newBalance}`);

      
       
        if(transactionAmount < oldBalance){
          newBalance = oldBalance - transactionAmount;
          BankAccountDAO.update(accountID, { Balance: newBalance }, (err, result) => {
            if (err) {
              console.error('Error updating bank account balance:', err);
              return callback(new Error('Failed to update bank account balance.'));
            }
            return callback(null, { message: true });
          });
        }else{
          return callback(null, { message: false });
        }
        
     
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
