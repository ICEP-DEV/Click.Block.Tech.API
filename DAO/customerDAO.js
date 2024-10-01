const db = require('../config/config');
const BankAccount = require('../models/bankAccount');
const Customer = require('../models/customer');

const CustomerDAO = {
  create: (customerData, callback) => {
    const sql = 'INSERT INTO customer SET ?';
    db.query(sql, customerData, callback); // Create a new customer
  },
  //returning the accountID when the account number match 
  getbyAccountNumber: (accountNum, callback)=>{
    const sql = 'SELECT * FROM bankaccount WHERE AccountNr = ?';
    db.query(sql, [accountNum], (err, result) => {
      if (err) {
        callback(err, null);
      } else {

        if (result.length > 0) {
          const bankAccount = new BankAccount(
            result[0].AccountID,
          );
    
          callback(null, bankAccount);
        } else {
          callback(null, null);  
        }
      }
    });
  },

    getById: (custID_Nr, callback) => {
    const sql = `
      SELECT 
        c.CustID_Nr, c.FirstName, c.LastName, c.PhoneNumber, 
        c.Address, c.Email, c.DateOfBirth, c.LoginPin, c.AlertPin, 
        c.isVerified, c.PanicButtonStatus, c.AccountID, 
        b.AccountNr, b.AccountType, b.Balance
      FROM 
        customer c
      LEFT JOIN 
        bankaccount b ON c.AccountID = b.AccountID
      WHERE 
        c.CustID_Nr = ?`;

    db.query(sql, [custID_Nr], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      if (result.length > 0) {
        const customer = {
          CustID_Nr: result[0].CustID_Nr,
          FirstName: result[0].FirstName,
          LastName: result[0].LastName,
          PhoneNumber: result[0].PhoneNumber,
          Address: result[0].Address,
          Email: result[0].Email,
          DateOfBirth: result[0].DateOfBirth,
          LoginPin: result[0].LoginPin,
          AlertPin: result[0].AlertPin,
          isVerified: result[0].isVerified,
          PanicButtonStatus: result[0].PanicButtonStatus,
          AccountID: result[0].AccountID,
          BankAccount: {
            AccountNumber: result[0].AccountNumber,
            AccountType: result[0].AccountType,
            Balance: result[0].Balance
          }
        };
        callback(null, customer);
      } else {
        callback(null, null);
      }
    });
  },

  update: (custID_Nr, updateData, callback) => {
    const sql = 'UPDATE customer SET ? WHERE CustID_Nr = ?';
    db.query(sql, [updateData, custID_Nr], callback); // Update customer info
  },

  delete: (custID_Nr, callback) => {
    const sql = 'DELETE FROM customer WHERE CustID_Nr = ?';
    db.query(sql, [custID_Nr], callback); // Delete customer record
  }
};

module.exports = CustomerDAO;
