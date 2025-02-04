const db = require('../config/config');
const BankAccount = require('../models/bankAccount');
const BankCard = require('../models/bankCard');
const Customer = require('../models/customer');
const ContactMeMessages = require('../models/contactMeMessage');
const Transactions = require('../models/transaction')

const CustomerDAO = {
  create: (customerData, callback) => {
    console.log("Customer Data being inserted:", customerData);
    const sql = 'INSERT INTO customer SET ?';

    db.query(sql, customerData, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return callback({ status: 400, message: 'Duplicate entry for customer' });
        }
        return callback({ status: 500, message: 'Database error' });
      }

      callback(null, result);
    });
  },

  checkDuplicate: (custID_Nr, callback) => {
    const sql = 'SELECT COUNT(*) AS count FROM customer WHERE CustID_Nr = ?';
    
    db.query(sql, [custID_Nr], (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return callback({ status: 500, message: 'Database error' });
      }
      callback(null, results[0].count > 0); 
    });
  },

  updateFields: (custID_Nr, updateData, callback) => {
    const sql = 'UPDATE customer SET ? WHERE CustID_Nr = ?';

    db.query(sql, [updateData, custID_Nr], (err, result) => {
      if (err) {
        console.error('Error updating customer:', err);
        return callback({ status: 500, message: 'Database error' });
      }
      console.log('Update result:', result);
      callback(null, result);
    });
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
  getAccountIDbyCardNum: (cardNum,callback)=>{
    const sql = 'SELECT * FROM bankcard WHERE CardNumber = ?';
    db.query(sql, [cardNum], (err, result) => {
      if (err) {
        callback(err, null);
      } else {

        if (result.length > 0) {
          const bankCard = new BankCard(
            result[0].CardID,
            result[0].AccountID,
            result[0].CardNumber,
            result[0].CardType,
            result[0].ExpirationDate,
            result[0].CVV,
            result[0].IsActive,
          );
    
          callback(null, bankCard);
        } else {
          callback(null, null);  
        }
      }
    });
  },
   getCustomerByAccID: (accountID, callback)=>{
    const sql = 'SELECT * FROM customer WHERE AccountID = ?';
    db.query(sql, [accountID], (err, result) =>{
      if(err){
        callback(err, null);
      }else{
        if(result.length > 0){
          const customer = new Customer(
          result[0].CustID_Nr,
          result[0].FirstName,
          result[0].LastName,
          result[0].PhoneNumber,
          result[0].Address,
          result[0].Email,
          result[0].DateOfBirth,
          result[0].LoginPin,
          result[0].AlertPin,
          result[0].isVerified,
          result[0].PanicButtonStatus,
          result[0].AccountID,
          result[0].LastLogin
          );
          callback(null, customer);
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
        c.isVerified, c.PanicButtonStatus, c.AccountID,c.LastLogin, 
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
          LastLogin: result[0].LastLogin,
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

  // Assuming this is in customerDAO.js
updatePin : (custID_Nr, newPin, callback) => {
  const query = 'UPDATE Customer SET loginPin = ? WHERE CustID_Nr = ?';
  db.query(query, [newPin, custID_Nr], (err, result) => {
      if (err) {
          return callback(err); // Pass error to callback
      }
      callback(null, { message: 'PIN updated successfully!' }); // Pass success message to callback
  });
},

  update: (custID_Nr, updateData, callback) => {
    const sql = 'UPDATE customer SET ? WHERE CustID_Nr = ?';
    db.query(sql, [updateData, custID_Nr], callback); // Update customer info
  },
  

  delete: (custID_Nr, callback) => {
    const sql = 'DELETE FROM customer WHERE CustID_Nr = ?';

    db.query(sql, [custID_Nr], (err, result) => {
      if (err) {
        console.error('Error deleting customer:', err);
        return callback({ status: 500, message: 'Database error' });
      }
      console.log('Delete result:', result);
      callback(null, result);
    });
  },

  getAll: (callback) => {
    const sql = 'SELECT * FROM customer';

    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error retrieving customers:', err);
        return callback({ status: 500, message: 'Database error' });
      }
      const customers = results.map(result => new Customer(
        result.CustID_Nr,
        result.FirstName,
        result.LastName,
        result.PhoneNumber,
        result.Address,
        result.Email,
        result.DateOfBirth,
        result.LoginPin,
        result.AlertPin,
        result.isActive,
        result.isVerified,
        result.PanicButtonStatus,
        result.AccountID,
        result.LastLogin
      ));
      callback(null, customers);
    });
  },
  updateLastLogin: (custID_Nr, callback) => {
    const sql = 'UPDATE customer SET LastLogin = ? WHERE CustID_Nr = ?';
    const currentTimestamp = new Date(); // Current timestamp
    db.query(sql, [currentTimestamp, custID_Nr], (err, result) => {
        if (err) {
            console.error('Error updating LastLogin:', err);
            return callback({ status: 500, message: 'Database error' });
        }
        callback(null, result);
    });
},

// Get customer details
getCustomerDetails: (custID_Nr, callback) => {
  const sql = `
    SELECT 
      c.FirstName AS firstName, 
      c.LastName AS lastName, 
      c.Email AS email, 
      c.PhoneNumber AS phoneNumber, 
      c.LastLogin AS lastLogin, 
      c.Address AS address, 
      b.CreationDate AS registeredOn
    FROM 
      Customer c
    LEFT JOIN 
      BankAccount b ON c.AccountID = b.AccountID
    WHERE 
      c.CustID_Nr = ?;
  `;

  db.query(sql, [custID_Nr], (err, result) => {
    if (err) {
      console.error("Error fetching customer details:", err);
      return callback(new Error("Database error while fetching customer details"), null);
    }

    if (result.length > 0) {
      const customerDetails = result[0];
      return callback(null, customerDetails);
    } else {
      return callback(null, null);
    }
  });
},

// Get messages by customer ID
getMessagesByCustomerId: (custID_Nr, callback) => {
  const sql = `
    SELECT 
      cm.SentTime AS time
    FROM 
      ContactMeMessage cm
    WHERE 
      cm.CustID_Nr = ?;
  `;

  db.query(sql, [custID_Nr], (err, result) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return callback(new Error("Database error while fetching messages"), null);
    }

    const messages = result.map(row => ({
      type: 'Support Message',
      time: row.time
    }));

    return callback(null, messages);
  });
},

findCustomerByEmail: (Email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Customer WHERE Email = ?';

    db.query(query, [Email], (err, results) => {
      if (err) {
        return reject(err); // Reject with an error
      }

      if (results.length === 0) {
        return resolve(null); // No customer found
      }
     
      resolve(results[0]); // Return the first customer
    });
  });
},

// Get transactions by customer ID
getTransactionsByCustomerId: (custID_Nr, callback) => {
  const sql = `
    SELECT 
      t.TransactionType AS type, 
      t.TransactionDate AS date
    FROM 
      Transaction t
    INNER JOIN 
      BankAccount b ON t.AccountID = b.AccountID
    INNER JOIN 
      Customer c ON b.AccountID = c.AccountID
    WHERE 
      c.CustID_Nr = ?;
  `;

  db.query(sql, [custID_Nr], (err, result) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return callback(new Error("Database error while fetching transactions"), null);
    }

    const transactions = result.map(row => ({
      type: row.type,
      date: row.date
    }));

    return callback(null, transactions);
  });
},

//Customer details with associated Alert Logs
getCustomerDetailsWithAlerts: (AccountNr, callback) => {
  const sql = `
    SELECT
      c.FirstName, c.LastName, c.Email, c.PhoneNumber, c.Address,
      ap.CustID_Nr AS "Id Number",
      YEAR(ap.TriggerDate) AS "year",
      DATE_FORMAT(ap.TriggerDate, '%d %b') AS "date",
      COUNT(*) AS "count",
      a.SentDate,
      CASE WHEN b.isActive = 0 AND c.PanicButtonStatus = 1 THEN 'Frozen Account' ELSE 'Active' END AS Frozen,
      l.StreetAddress AS ActivityLocation
    FROM customer c
    LEFT JOIN alertpinlogs ap ON c.CustID_Nr = ap.CustID_Nr
    LEFT JOIN alert a ON c.CustID_Nr = a.CustID_Nr
    LEFT JOIN bankaccount b ON c.AccountID = b.AccountID
    LEFT JOIN location l ON a.LocationID = l.LocationID
    WHERE b.AccountNr = ?  -- Changed to use AccountNr
    GROUP BY c.CustID_Nr, YEAR(ap.TriggerDate), DATE_FORMAT(ap.TriggerDate, '%Y-%m-%d'), a.SentDate
  `;

  db.query(sql, [AccountNr], (err, result) => {
    if (err) {
      return callback(err);
    }
    if (result.length === 0) {
      return callback(new Error('Customer not found or no logs available'));
    }

    // Process the result
    const customerDetails = result[0];
    const painiButtonActivation = result.map(log => ({
      "Id Number": log["Id Number"],
      year: log.year,
      date: log.date,
      count: log.count
    }));

    const recentActivation = result.map(log => ({
      AlertTriggered: `${log.SentDate} (10:05)`,
      Frozen: `${log.Frozen} (10:06)`,
      ActivityLocation: log.ActivityLocation,
      CurrentLocation: log.CurrentLocation,
      AlerttoSAPS: log.AlertToSAPS === '1' ? 'Yes' : 'No'
    }));

    const response = {
      fullname: `${customerDetails.FirstName} ${customerDetails.LastName}`,
      EmailAddress: customerDetails.Email,
      PhoneNumber: customerDetails.PhoneNumber,
      PhysicalAddress: customerDetails.Address,
      painiButtonActivation,
      recentActivation
    };

    callback(null, response);
  });
},

};


module.exports = CustomerDAO;
