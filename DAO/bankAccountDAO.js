const db = require('../config/config');
const BankAccount = require('../models/bankAccount');

const BankAccountDAO = {
  create: (accountData, callback) => {
    const sql = 'INSERT INTO bankaccount SET ?';
    db.query(sql, accountData, (err, result) => {
      if (err) {
        return callback(new Error('Failed to create account: ' + err.message));
      }
      callback(null, { id: result.insertId, ...accountData });
    });
  },

  getById: (accountID, callback) => {
    const sql = 'SELECT * FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve account: ' + err.message));
      }
      if (result.length > 0) {
        const bankAccount = new BankAccount(
          result[0].AccountID,
          result[0].AccountNr,
          result[0].ExpirationDate,
          result[0].AccountType,
          result[0].Balance,
          result[0].CreationDate,
          result[0].isActive
        );
        return callback(null, bankAccount);
      }
      callback(null, null); // Account not found
    });
  },

  getByAccountNr: (accountNr, callback) => {
    const sql = 'SELECT * FROM bankaccount WHERE AccountNr = ?';
    db.query(sql, [accountNr], (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve account by number: ' + err.message));
      }
      callback(null, result.length > 0 ? new BankAccount(
        result[0].AccountID,
        result[0].AccountNr,
        result[0].ExpirationDate,
        result[0].AccountType,
        result[0].Balance,
        result[0].CreationDate,
        result[0].isActive
      ) : null);
    });
  },

  update: (accountID, updateData, callback) => {
    const sql = 'UPDATE bankaccount SET ? WHERE AccountID = ?';
    db.query(sql, [updateData, accountID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to update account: ' + err.message));
      }
      callback(null, result.affectedRows > 0); // Returns true if update was successful
    });
  },

  delete: (accountID, callback) => {
    const sql = 'DELETE FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to delete account: ' + err.message));
      }
      callback(null, result.affectedRows > 0); // Returns true if deletion was successful
    });
  }
};

module.exports = BankAccountDAO;
