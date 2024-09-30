const CustomerService = require('../service/customerService');

// Create a new customer
const createCustomer = (req, res) => {
  const customerData = req.body;

  // Ensure required fields are provided
  if (!customerData.CustID_Nr || !customerData.Email) {
    return res.status(400).send('Customer ID and Email are required');
  }

  CustomerService.createCustomer(customerData, (err, result) => {
    if (err) {
      return res.status(500).send(err.message); // Improved error response
    }
    res.status(201).json(result); // Customer created successfully
  });
};

// Get customer details by CustID_Nr
const getCustomer = (req, res) => {
  const custID_Nr = req.params.custID_Nr;

  if (!custID_Nr) {
    return res.status(400).send('Customer ID is required');
  }

  CustomerService.getCustomerById(custID_Nr, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (result) {
      // Return customer details
      res.status(200).json(result);
    } else {
      res.status(404).send('Customer not found');
    }
  });
};

// Get customer bank account details by CustID_Nr
const getCustomerAccount = (req, res) => {
  const custID_Nr = req.params.custID_Nr;

  if (!custID_Nr) {
    return res.status(400).send('Customer ID is required');
  }

  // Call service to fetch customer and their associated bank account
  CustomerService.getCustomerAccountById(custID_Nr, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (result) {
      // Return customer and bank account details
      res.status(200).json(result);
    } else {
      res.status(404).send('Customer or associated bank account not found');
    }
  });
};

module.exports = { createCustomer, getCustomer, getCustomerAccount };
