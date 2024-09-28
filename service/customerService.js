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
      if (!custID_Nr) return callback(new Error('Customer ID is required'));
  
      // Now the account details will be fetched along with the customer
      CustomerDAO.getById(custID_Nr, callback);
    },

  updateCustomer: (custID_Nr, updateData, callback) => {
    if (!custID_Nr || !updateData) return callback(new Error('Customer ID and update data are required'));

    CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);
      if (!existingCustomer) return callback(new Error('Customer not found'));

      CustomerDAO.update(custID_Nr, updateData, callback); // Update customer data
    });
  },

  deleteCustomer: (custID_Nr, callback) => {
    if (!custID_Nr) return callback(new Error('Customer ID is required'));

    CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);
      if (!existingCustomer) return callback(new Error('Customer not found'));

      CustomerDAO.delete(custID_Nr, callback); // Delete customer
    });
  },
};

module.exports = CustomerService;
