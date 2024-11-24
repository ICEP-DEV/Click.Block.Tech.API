const db = require('../config/config');
const BankAccount = require('../models/bankAccount'); // Assuming this model exists

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

  verifyPin: (customerID, pin, callback = () => {}) => {
    console.log('Verifying PIN for customerID:', customerID);
    const query = 'SELECT LoginPin FROM customer WHERE CustID_Nr = ? AND LoginPin = ?';

    db.query(query, [customerID, pin], (err, result) => {
      if (err) {
        console.error('Error verifying PIN:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      if (result.length > 0) {
        console.log("PIN verification successful.");
        callback(null, true); // Return true if the PIN matches
      } else {
        console.log("PIN verification failed.");
        callback(null, false); // Return false if the PIN does not match
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

  createTransaction: (transactionData, callback = () => {}) => {
    console.log('Creating transaction with data:', transactionData);
    const query = 'INSERT INTO transaction SET ?';

    db.query(query, transactionData, (err, result) => {
      if (err) {
        console.error('Error creating transaction:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      console.log("Transaction created successfully:", result);
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
        console.log('Transaction found 666666666:', result[0]);
        if (callback) callback(null, result[0]); // Use callback if provided
      } else {
        console.log('No transaction found with this ID.');
        if (callback) callback(null, null); // Use callback if provided
      }
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

  getLatestPendingTransactionByCustID: (custID_Nr) => {
    return new Promise((resolve, reject) => {
      console.log('Fetching latest pending transaction for customer:', custID_Nr);
  
      const query = `
        SELECT t.TransactionID
        FROM Transaction t
        JOIN BankAccount b ON t.AccountID = b.AccountID
        JOIN Customer c ON b.AccountID = c.AccountID
        WHERE c.CustID_Nr = ?
        AND t.Status = 'pending'
        ORDER BY t.TransactionDate DESC
        LIMIT 1;
      `;
  
      db.query(query, [custID_Nr], (err, results) => {
        if (err) {
          console.error('Error fetching latest pending transaction:', err);
          return reject({ status: 500, message: 'Database error' });
        }
  
        if (results.length === 0) {
          console.log('No pending transactions found for customer:', custID_Nr);
          return reject({ status: 404, message: 'No pending transactions found' });
        }
  
        console.log('Transaction:', results);
        console.log('Latest pending transaction found for customer:', custID_Nr, 'TransactionID:', results[0].TransactionID);
  
        // Resolve the Promise with the result (TransactionID)
        resolve(results);
      });
    });
  }
  
};

module.exports = TransactionDAO;
