const CustomerDAO = require('../DAO/customerDAO');

const CustomerService = {
  
  
  createCustomer: (customerData, callback) => {
    
    if (!customerData.CustID_Nr || !customerData.Email) {
      return callback(new Error('Customer ID and Email are required'));
    }


    CustomerDAO.getById(customerData.CustID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);

      if (existingCustomer) {
        return callback(new Error('Customer already exists'));
      }

      CustomerDAO.create(customerData, callback);
    });
  },


  getCustomerById: (custID_Nr, callback) => {
    CustomerDAO.getById(custID_Nr, (err, customer) => {
      if (err) return callback(err);

      if (!customer) {
        return callback(new Error('Customer not found'));
      }

      callback(null, customer);
    });
  },

  
  updateCustomer: (custID_Nr, updateData, callback) => {
    CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);

      if (!existingCustomer) {
        return callback(new Error('Customer not found'));
      }

      
      CustomerDAO.update(custID_Nr, updateData, (updateErr, result) => {
        if (updateErr) {
          return callback(updateErr);
        }
        callback(null, result);
      });
    });
  },


  deleteCustomer: (custID_Nr, callback) => {
    CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);

      if (!existingCustomer) {
        return callback(new Error('Customer not found'));
      }

     
      CustomerDAO.delete(custID_Nr, (deleteErr, result) => {
        if (deleteErr) {
          return callback(deleteErr);
        }
        callback(null, result);
      });
    });
  }
};

module.exports = CustomerService;
