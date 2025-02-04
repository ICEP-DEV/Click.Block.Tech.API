const NotificationService = require('../service/notificationService');
const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const NotificationDAO = require('../DAO/notificationDAO');
const Transaction = require('../models/transaction');
const Notification = require('../models/notification');

class TransactionService {
  // This function creates a pending transaction that will wait for approval
  createTransaction(transactionType, transactionAmount, status, date, accountID, callback) {
    TransactionDAO.getBankAccountById(accountID, (err, bankAccount) => {
      if (err) {
        console.error('Error fetching customer:', err);
        return callback({ status: 500, message: 'Failed to fetch customer' });
      }
      if (!bankAccount) return callback(new Error('Account Number is required'));

      // Checking if the bank account is active
      if (bankAccount.isActive === 0) {
        const transactionID = -1;
        return callback({ transactionID, message: 'Transaction cannot proceed as account is disabled.' });
      }

      const pendingTransaction = new Transaction(
        null,
        accountID,
        transactionType,
        date, // This is to get the CurrentDate and Time
        transactionAmount,
        status,
        0
      );

      // Save the pending transaction to the database and retrieve its ID
      TransactionDAO.createPendingTransaction(pendingTransaction, (err, transactionID) => {
        if (err) return callback(new Error('Error saving pending transaction.'));
        return callback(null, { transactionID, message: 'Transaction created and awaiting approval' });
      });
    });
  }

  getTransactionByAccID(accountID, transStatus, callback) {
    if (!accountID || !transStatus) {
      return callback(new Error('Account ID and transaction status are required'), null);
    }
    TransactionDAO.getAllTransactionsByAccountID(accountID, transStatus, (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return callback(err, null);
      }
      return callback(null, transactions);
    });
  }

  getAllTransactionByAccID(accountID, callback) {
    if (!accountID) {
      return callback(new Error('Account ID is required'), null);
    }
    TransactionDAO.getAllTransactionsByAccID(accountID, (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return callback(err, null);
      }
      return callback(null, transactions);
    });
  }

  // Fetch bank account details
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
      return callback(null, bankAccount);
    });
  }

  // Update transaction status
  updateTransactionStatus(transactionID, status, callback) {
    TransactionDAO.updateTransactionStatus(status, transactionID, (err, result) => {
      if (err) {
        console.error('Error updating status:', err);
        return callback(new Error('Failed to update transaction status.'));
      }
      return callback(null, result);
    });
  }

  // Update bank account balance
  updateAccountBalance(accountID, newBalance, callback) {
    TransactionDAO.updateBankAccountBalance(accountID, newBalance, (err, result) => {
      if (err) {
        console.error('Error updating balance:', err);
        return callback(new Error('Failed to update account balance.'));
      }
      return callback(null, result);
    });
  }

  // Get transaction by ID
  getTransactionByID(transactionID, callback) {
    TransactionDAO.getTransactionById(transactionID, (err, transaction) => {
      if (err) {
        console.error('Error fetching transaction:', err);
        return callback(new Error('Failed to retrieve transaction.'));
      }
      if (!transaction) {
        console.error('Transaction not found for ID:', transactionID);
        return callback(new Error('Transaction not found.'));
      }
      return callback(null, transaction);
    });
  }

  // Update transaction panic status
  updateTransacPanicStatus(transactionId, status, callback) {
    TransactionDAO.updateTransacPanicStatus(transactionId, status, (err, result) => {
      if (err) {
        console.error('Error updating transaction panic status:', err);
        return callback(new Error('Failed to update transaction panic status.'));
      }
      return callback(null, result);
    });
  }

  // Fetch transactions by account ID and date range
  fetchTransactions(accountId, startDate, endDate, callback) {
    if (!accountId || !startDate || !endDate) {
      return callback({ status: 400, message: 'Missing required parameters' });
    }

    TransactionDAO.getTransactionsByAccountId(accountId, startDate, endDate, (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return callback(err);
      }
      callback(null, transactions);
    });
  }
}

module.exports = new TransactionService();
