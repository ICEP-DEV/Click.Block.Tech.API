const db = require('../config/config');
const Customer = require('../models/customer');

const CustomerDAO = {
  create: (customerData, callback) => {
    const sql = 'INSERT INTO customer SET ?';
    db.query(sql, customerData, callback);
  },


  getById: (custID_Nr, callback) => {
    const sql = 'SELECT * FROM customer WHERE CustID_Nr = ?';
    db.query(sql, [custID_Nr], (err, result) => {
     
      if (err) {
        callback(err, null);
      } else {

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
            result[0].PanicButtonStatus,
            result[0].AdminID
          );
    
          callback(null, customer);
        } else {
          callback(null, null);  
        }
      }
    });
  },

  update: (custID_Nr, updateData, callback) => {
    const sql = 'UPDATE customer SET ? WHERE CustID_Nr = ?';
    db.query(sql, [updateData, custID_Nr], callback);
    
  },

  delete: (custID_Nr, callback) => {
    const sql = 'DELETE FROM customer WHERE CustID_Nr = ?';
    db.query(sql, [custID_Nr], callback);
  }

};

module.exports = CustomerDAO;
