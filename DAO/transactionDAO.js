const db = require('../config/config'); 
const BankAccount = require('../models/bankAccount'); // Assuming this model exists

const TransactionDAO = {
  getCustomerByCardNumber: (cardNumber, callback) => {
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

  verifyPin: (customerID, pin, callback) => {
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

  createPendingTransaction: (transactionData, callback) => {
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

  createTransaction: (transactionData, callback) => {
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

  updateTransactionStatus: (transactionId, status, callback) => {
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

  getTransactionById: (transactionId, callback) => {
    const query = 'SELECT * FROM transaction WHERE transactionId = ?';

    db.query(query, [transactionId], (err, result) => {
      if (err) {
        console.error('Error retrieving transaction by ID:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      if (result.length > 0) {
        console.log("Transaction found:", result[0]);
        callback(null, result[0]); // Return the transaction if found
      } else {
        console.log("No transaction found with this ID.");
        callback(null, null); // Return null if no result is found
      }
    });
  },

  // Example method to get a bank account by ID (you can modify as needed)
  getBankAccountById: (accountId, callback) => {
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

  // Example method to update the bank account balance
  updateBankAccountBalance: (accountId, newBalance, callback) => {
    const query = 'UPDATE bankaccount SET Balance = ? WHERE AccountID = ?';

    db.query(query, [newBalance, accountId], (err, result) => {
      if (err) {
        console.error('Error updating bank account balance:', err);
        return callback({ status: 500, message: 'Database error' });
      }

      console.log("Bank account balance updated successfully:", result);
      callback(null, result.affectedRows); // Return the number of affected rows
    });
  }
};

module.exports = TransactionDAO;
