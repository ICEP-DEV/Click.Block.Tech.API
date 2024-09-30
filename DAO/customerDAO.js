const db = require('../config/config');
const Customer = require('../models/customer');

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

  getById: (custID_Nr, callback) => {
    const sql = 'SELECT * FROM customer WHERE CustID_Nr = ?';

    db.query(sql, [custID_Nr], (err, result) => {
      if (err) {
        console.error('Error retrieving customer:', err);
        return callback({ status: 500, message: 'Database error' });
      }
      if (result.length > 0) {
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
          result[0].isActive,
          result[0].isVerified,
          result[0].PanicButtonStatus,
          result[0].AccountID
        );
        return callback(null, customer);
      } else {
        callback(null, null);
      }
    });
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
        result.AccountID
      ));
      callback(null, customers);
    });
  }
};

module.exports = CustomerDAO;
