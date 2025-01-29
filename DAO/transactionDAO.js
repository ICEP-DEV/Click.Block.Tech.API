const db = require('../config/config'); 
const BankAccount = require('../models/bankAccount'); // Assuming this model exists
const Transaction = require('../models/transaction');

const TransactionDAO = {
  getCustomerByCardNumber: (cardNumber, callback = () => {}) => {
    console.log('Calling getCustomerByCardNumber with card number:', cardNumber);
    const query = `SELECT c.CustID_Nr, c.AccountID
                   FROM customer c 
                   JOIN bankcard bc ON c.AccountID = bc.AccountID 
                   JOIN bankaccount ba ON bc.AccountID = ba.AccountID 
                   WHERE bc.CardNumber = ?`;

    db.query(query, [cardNumber], (err, result) => {
      if (err) {
        console.error('Error retrieving customer by card number:', err);
        return callback({ status: 500, message: 'Database error' }, null);
      }

      if (result.length > 0) {
        console.log("Customer found:", result[0]);
        callback(null, result[0]); // Return the first row if customer is found
      } else {
        console.log("No customer found with this card number.");
        callback(null, null); // Return null if no result is found
      }
    });
  },

  createPendingTransaction: (transactionData, callback = () => {}) => {
    console.log('Creating pending transaction with data:', transactionData);
    const query = 'INSERT INTO transaction SET ?';

    db.query(query, transactionData, (err, result) => {

        if (err) {
            console.error('Error creating pending transaction:', err);
            return callback({ status: 500, message: 'Database error' });
        }

        console.log("Pending transaction created successfully:", result);
        callback(null, result.insertId); // Return the newly created transaction ID

    });
  },


  updateTransactionStatus: (transactionId, status, callback = () => {}) => {
    console.log('Updating transaction status for transactionId:', transactionId, 'to status:', status);
    const query = 'UPDATE transaction SET status = ? WHERE transactionId = ?';

    db.query(query, [status, transactionId], (err, result) => {
      if (err) {
        console.error('Error updating transaction status:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      console.log("Transaction status updated successfully:", result);
      callback(null, result.affectedRows); // Return the number of affected rows
    });
  },

  getTransactionById: (transactionId, callback = null) => {
    console.log('Getting transaction by ID:', transactionId); // Log the transactionId value
    const query = 'SELECT * FROM transaction WHERE transactionId = ?';
  
    db.query(query, [transactionId], (err, result) => {
      if (err) {
        console.error('Error retrieving transaction by ID:', err);
        if (callback) callback({ status: 500, message: 'Database error' });
        return;
      }
  
      console.log('Query result:', result); // Log the query result for debugging
  
      if (result.length > 0) {
        console.log('Transaction found :', result[0]);
        if (callback) callback(null, result[0]); // Use callback if provided
      } else {
        console.log('No transaction found with this ID.');
        if (callback) callback(null, null); // Use callback if provided
      }
    });
  },
  
  getAllTransactionsByAccountID: (accountID,transStatus, callback = null) => {
    const query = 'SELECT * FROM transaction WHERE AccountID = ? AND Status = ?';
  
    db.query(query, [accountID, transStatus], (err, results) => {
      if (err) {
        console.error('Error retrieving transaction by ID:', err);
        if (callback) callback({ status: 500, message: 'Database error' });
        return;
      }
      const transactions = results.map(result => new Transaction(
        result.TransactionID,
        result.AccountID,
        result.TransactionType,
        result.TransactionDate,
        result.TransactionAmount,
        result.Status,
        result.IsPanicTrigered
      ));
      callback(null, transactions);
    });
  },

  getAllTransactionsByAccID: (accountID, callback) => {
    console.log('Fetching transactions for AccountID:', accountID);
  
    const query = 'SELECT * FROM transaction WHERE AccountID = ?';
    db.query(query, [accountID], (err, results) => {
      if (err) {
        console.error('Error retrieving transactions by AccountID:', err);
        // Ensure the callback is called correctly
        return callback({ status: 500, message: 'Database error' }, null);
      }
  
      const transactions = results.map(result => new Transaction(
        result.TransactionID,
        result.AccountID,
        result.TransactionType,
        result.TransactionDate,
        result.TransactionAmount,
        result.Status,
        result.IsPanicTrigered
      ));
  
      console.log('Transactions retrieved:', transactions.length);
      return callback(null, transactions); // Call with null error when successful
    });
  },
  

  getBankAccountById: (accountId, callback = () => {}) => {
    console.log('Getting bank account by AccountID:', accountId);
    const query = 'SELECT * FROM bankaccount WHERE AccountID = ?';

    db.query(query, [accountId], (err, result) => {
      if (err) {
        console.error('Error retrieving bank account by ID:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      if (result.length > 0) {
        console.log("Bank account found:", result[0]);
        callback(null, result[0]); // Return the bank account if found
      } else {
        console.log("No bank account found with this ID.");
        callback(null, null); // Return null if no result is found
      }
    });
  },

  updateBankAccountBalance: (accountId, newBalance, callback = () => {}) => {
    console.log('Updating bank account balance for AccountID:', accountId, 'to new balance:', newBalance);
    const query = 'UPDATE bankaccount SET Balance = ? WHERE AccountID = ?';

    db.query(query, [newBalance, accountId], (err, result) => {
      if (err) {
        console.error('Error updating bank account balance:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      console.log("Bank account balance updated successfully:", result);
      callback(null, result.affectedRows); // Return the number of affected rows
    });
  },

  updateTransacPanicStatus: (transactionID, status, callback = () => {}) => {
    
    const query = 'UPDATE transaction SET IsPanicTrigered = ? WHERE TransactionID = ?';

    db.query(query, [status, transactionID], (err, result) => {
      if (err) {
        console.error('Error updating transaction panic status:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      console.log("Transaction Panic Status updated successfully:", result);
      callback(null, result.affectedRows);
    });
  },

  getTransactionsByAccountId: (accID, startDate, endDate, callback = () => {}) => {
    const query = `
      SELECT * FROM transaction 
      WHERE AccountID = ? 
        AND TransactionDate BETWEEN ? AND ?
    `;
  
    db.query(query, [accID, startDate, endDate], (err, rows) => {
      if (err) {
        return callback({ status: 500, message: 'Database error' }, null);
      }
      callback(null, rows);
    });
  },

};

module.exports = TransactionDAO;
