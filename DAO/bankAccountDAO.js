const db = require('../config/config');
const BankAccount = require('../models/bankAccount');

const BankAccountDAO = {
  create: (accountData, callback) => {
    const sql = 'INSERT INTO bankaccount SET ?';
    db.query(sql, accountData, callback);
  },

  getById: (accountID, callback) => {
    const sql = 'SELECT * FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
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
          callback(null, bankAccount);
        } else {
          callback(null, null);
        }
      }
    });
  },

  getByAccountNr: (accountNr, callback) => {
    const sql = 'SELECT * FROM bankaccount WHERE AccountNr = ?';
    db.query(sql, [accountNr], callback);
  },

  update: (accountID, updateData, callback) => {
    const sql = 'UPDATE bankaccount SET ? WHERE AccountID = ?';
    db.query(sql, [updateData, accountID], callback);
  },

  delete: (accountID, callback) => {
    const sql = 'DELETE FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], callback);
  }
};

module.exports = BankAccountDAO;
