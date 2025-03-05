const NotificationService = require('../service/notificationService');
const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const NotificationDAO = require('../DAO/notificationDAO');
const Transaction = require('../models/transaction');
const Notification = require('../models/notification');
const { sendEmailWithPdf } = require('../service/emailService'); // Assuming your email logic is in utils


class TransactionService {
  // This function creates a pending transaction that will wait for approval
  createTransaction(transactionType, transactionAmount, status, date, accountID, callback) {
    if (!transactionType || !transactionAmount || !status || !date || !accountID) {
      return callback({ status: 400, message: 'Missing required parameters' });
    }

    TransactionDAO.getBankAccountById(accountID, (err, bankAccount) => {
      if (err) {
        console.error('Error fetching bank account:', err);
        return callback({ status: 500, message: 'Failed to fetch bank account' });
      }

      if (!bankAccount) {
        return callback({ status: 404, message: 'Bank account not found' });
      }

      // Checking if the bank account is active
      if (bankAccount.isActive === 0) {
        return callback({ status: 400, message: 'Transaction cannot proceed as account is disabled.' });
      }

      const pendingTransaction = new Transaction(
        null,
        accountID,
        transactionType,
        date,
        transactionAmount,
        status,
        0 // Pending status
      );

      // Save the pending transaction to the database and retrieve its ID
      TransactionDAO.createPendingTransaction(pendingTransaction, (err, transactionID) => {
        if (err) {
          console.error('Error saving pending transaction:', err);
          return callback({ status: 500, message: 'Error saving pending transaction' });
        }
        return callback(null, { transactionID, message: 'Transaction created and awaiting approval' });
      });
    });
  }

  // Get transactions by account ID and status
  getTransactionByAccID(accountID, transStatus, callback) {
    if (!accountID || !transStatus) {
      return callback({ status: 400, message: 'Account ID and transaction status are required' });
    }

    TransactionDAO.getAllTransactionsByAccountID(accountID, transStatus, (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return callback({ status: 500, message: 'Error fetching transactions' });
      }

      return callback(null, transactions);
    });
  }

  // Get all transactions by account ID
  getAllTransactionByAccID(accountID, callback) {
    if (!accountID) {
      return callback({ status: 400, message: 'Account ID is required' });
    }

    TransactionDAO.getAllTransactionsByAccID(accountID, (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return callback({ status: 500, message: 'Error fetching transactions' });
      }
      
      return callback(transactions, null);
    });
  }

  // Fetch bank account details
  getBankAccount(accountID, callback) {
    if (!accountID) {
      return callback({ status: 400, message: 'Account ID is required' });
    }

    BankAccountDAO.getById(accountID, (err, bankAccount) => {
      if (err) {
        console.error('Error fetching bank account:', err);
        return callback({ status: 500, message: 'Failed to retrieve bank account' });
      }

      if (!bankAccount) {
        return callback({ status: 404, message: 'Bank account not found' });
      }

      return callback(null, bankAccount);
    });
  }

  // Update transaction status
  updateTransactionStatus(transactionID, status, callback) {
    if (!transactionID || !status) {
      return callback({ status: 400, message: 'Transaction ID and status are required' });
    }

    TransactionDAO.updateTransactionStatus(status, transactionID, (err, result) => {
      if (err) {
        console.error('Error updating status:', err);
        return callback({ status: 500, message: 'Failed to update transaction status' });
      }

      return callback(null, result);
    });
  }

  // Update bank account balance
  updateAccountBalance(accountID, newBalance, callback) {
    if (!accountID || newBalance === undefined) {
      return callback({ status: 400, message: 'Account ID and new balance are required' });
    }

    TransactionDAO.updateBankAccountBalance(accountID, newBalance, (err, result) => {
      if (err) {
        console.error('Error updating balance:', err);
        return callback({ status: 500, message: 'Failed to update account balance' });
      }

      return callback(null, result);
    });
  }

  // Get transaction by ID
  getTransactionByID(transactionID, callback) {
    if (!transactionID) {
      return callback({ status: 400, message: 'Transaction ID is required' });
    }

    TransactionDAO.getTransactionById(transactionID, (err, transaction) => {
      if (err) {
        console.error('Error fetching transaction:', err);
        return callback({ status: 500, message: 'Failed to retrieve transaction' });
      }

      if (!transaction) {
        return callback({ status: 404, message: 'Transaction not found' });
      }

      return callback(null, transaction);
    });
  }

  // Update transaction panic status
  updateTransacPanicStatus(transactionId, status, callback) {
    if (!transactionId || status === undefined) {
      return callback({ status: 400, message: 'Transaction ID and status are required' });
    }

    TransactionDAO.updateTransacPanicStatus(transactionId, status, (err, result) => {
      if (err) {
        console.error('Error updating transaction panic status:', err);
        return callback({ status: 500, message: 'Failed to update transaction panic status' });
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
        return callback({ status: 500, message: 'Error fetching transactions' });
      }

      return callback(null, transactions);
    });
  }


// sendTransactionReceipt function
sendTransactionReceipt(email, pdfBuffer, pdfFilename, callback) {
  sendEmailWithPdf(email, pdfBuffer, pdfFilename)
    .then((result) => {
      callback(null, { message: 'Email sent successfully', data: result });
    })
    .catch((error) => {
      callback(error, null);
    });
}



}

module.exports = new TransactionService();
