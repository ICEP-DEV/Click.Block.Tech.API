const db = require('../config/config');
const BankAccount = require('../models/bankAccount');
const Customer = require('../models/customer');

const BankAccountDAO = {
  create: (accountData, callback) => {
    const sql = 'INSERT INTO bankaccount SET ?';
    db.query(sql, accountData, (err, result) => {
      if (err) {
        console.error(err); // Added detailed error logging
        return callback(new Error('Failed to create account: ' + err.message));
      }
      callback(null, { id: result.insertId, ...accountData });
    });
  },

  getById: (accountID, callback) => {
    const sql = 'SELECT * FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
      if (err) {
        console.error(err);
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
          result[0].isActive,
          result[0].LastModified,
          result[0].RestorationCount
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
        console.error(err);
        return callback(new Error('Failed to retrieve account by number: ' + err.message));
      }
      callback(null, result.length > 0 ? new BankAccount(
        result[0].AccountID,
        result[0].AccountNr,
        result[0].ExpirationDate,
        result[0].AccountType,
        result[0].Balance,
        result[0].CreationDate,
        result[0].isActive,
        result[0].LastModified,
        result[0].RestorationCount
      ) : null);
    });
  },

  update: (accountID, updateData, callback) => {
    const sql = 'UPDATE bankaccount SET ? WHERE AccountID = ?';
    db.query(sql, [updateData, accountID], (err, result) => {
      if (err) {
        console.error(err);
        return callback(new Error('Failed to update account: ' + err.message));
      }
      callback(null, result.affectedRows > 0);
    });
  },

  delete: (accountID, callback) => {
    const sql = 'DELETE FROM bankaccount WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
      if (err) {
        console.error(err);
        return callback(new Error('Failed to delete account: ' + err.message));
      }
      callback(null, result.affectedRows > 0);
    });
  },

  updateLastModified: (accountID, callback) => {
    const sql = 'UPDATE bankaccount SET lastModified = NOW() WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) => {
        if (err) {
            console.error(err);
            return callback(new Error('Failed to update lastModified: ' + err.message));
        }
        callback(null, result.affectedRows > 0);
    });
  },

  countAllAccounts: (callback) => {
    const query = 'SELECT COUNT(*) AS total FROM bankaccount';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, results[0].total);
    });
  },

  countActiveAccounts: (callback) => {
    const query = 'SELECT COUNT(*) AS active FROM bankaccount WHERE isActive = 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
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
      if (err) {
        console.error(err);
        return callback(err);
      }
      callback(null, results[0].frozen);
    });
  },

  countDeactivatedAccounts: (callback) => {
    const query = 'SELECT COUNT(*) AS deactivated FROM bankaccount WHERE isActive = 0';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, results[0].deactivated);
    });
  },

  countRestoredAccounts: (callback) => {
    const query = 'SELECT SUM(restorationCount) AS restored FROM bankaccount WHERE restorationCount > 0';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, results[0].restored);
    });
  },

  restoreAccount: (accountID, callback) => {
    const sql = `
      UPDATE bankaccount 
      SET isActive = 1, 
          lastModified = NOW(), 
          restorationCount = restorationCount + 1 
      WHERE AccountID = ? AND isActive = 0
    `;
    db.query(sql, [accountID], (err, result) => {
      if (err) {
          console.error(err);
          return callback(new Error('Failed to restore account: ' + err.message));
      }
      callback(null, result.affectedRows > 0);
    });
  },

  getAccountActions: (callback) => {
    const query = `
        SELECT 
            bankaccount.AccountNr AS 'CustomerAccountNumber',
            CASE 
                WHEN bankaccount.isActive = 1 THEN 'Activated Account'
                WHEN bankaccount.isActive = 0 AND customer.PanicButtonStatus = 1 THEN 'Frozen Account'
                ELSE 'Inactive Account'
            END AS 'Action Type',
            bankaccount.LastModified AS 'Date/Time',
            CASE 
                WHEN bankaccount.isActive = 1 THEN 'Active'
                WHEN bankaccount.isActive = 0 AND customer.PanicButtonStatus = 1 THEN 'Frozen'
                ELSE 'Inactive'
            END AS 'Account Status',
            CASE 
                WHEN bankaccount.isActive = 0 AND customer.PanicButtonStatus = 1 THEN 'Automation'
                ELSE CONCAT(customer.FirstName, ' ', customer.LastName)
            END AS 'PerformedBy'
        FROM 
            bankaccount
        LEFT JOIN 
            customer ON bankaccount.AccountID = customer.AccountID
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return callback(err);
        }
        callback(null, results);
    });
}, 
getAllCustomerDetails: (callback) => {
  const query = `
      SELECT 
          customer.Email AS "Email Address",
          CONCAT(SUBSTRING(customer.FirstName, 1, 1), '. ', customer.LastName) AS "Customer Details",
          DATE_FORMAT(bankaccount.CreationDate, '%m/%d/%Y') AS "Registration Date",
          CASE 
              WHEN bankaccount.isActive = 1 THEN 'Active'
              ELSE 'Inactive'
          END AS "Account Status"
      FROM 
          customer
      JOIN 
          bankaccount ON customer.AccountID = bankaccount.AccountID;
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching customer details:', err);
          return callback(err);
      }
      callback(null, results);
  });
}


};

module.exports = BankAccountDAO;
