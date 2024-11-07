const db = require('../config/config');
const BankAccount = require('../models/bankAccount');
const Customer = require('../models/customer');


const BankAccountDAO = {
  create: (accountData, callback) => {
    const sql = 'INSERT INTO bankaccount SET ?';
    db.query(sql, accountData, (err, result) => {
      if (err) {
        return callback(new Error('Failed to create account: ' + err.message));
      }
      callback(null, { id: result.insertId, ...accountData });
      console.log(result.insertId);
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
      callback(null, null); 
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
      callback(null, result.affectedRows > 0); 
    });
  },

  delete: (accountID, callback) => {
    const sql = 'DELETE FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to delete account: ' + err.message));
      }
      callback(null, result.affectedRows > 0); 
    });
  },
  //Methods to do calculations for dashboard statistics 
  countAllAccounts: (callback) => {
    const query = 'SELECT COUNT(*) AS total FROM bankaccount';
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total);
    });
},
countActiveAccounts: (callback) => {
    const query = 'SELECT COUNT(*) AS active FROM bankaccount WHERE isActive = 1';
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].active);
    });
},
countFrozenAccounts: (callback) => {
  const query = `
      SELECT COUNT(*) AS frozen 
      FROM bankaccount 
      INNER JOIN customer ON bankaccount.AccountID = customer.AccountID 
      WHERE bankaccount.isActive = 0 AND customer.PanicButtonStatus = 1
  `;
  db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].frozen);
  });
},
countDeactivatedAccounts: (callback) => {
    const query = 'SELECT COUNT(*) AS deactivated FROM bankaccount WHERE isActive = 0';
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].deactivated);
    });
},
countRestoredAccounts: (callback) => {
    const query = `
        SELECT COUNT(*) AS restored
        FROM bankaccount
        WHERE isActive = 1 AND AccountID IN (
            SELECT AccountID
            FROM account_status_changes
            WHERE previousStatus = 0 AND currentStatus = 1
        )
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].restored);
    });
}
};



module.exports = BankAccountDAO;
