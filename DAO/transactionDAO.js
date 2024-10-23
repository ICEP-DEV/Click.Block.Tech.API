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
  }
};

module.exports = TransactionDAO;
