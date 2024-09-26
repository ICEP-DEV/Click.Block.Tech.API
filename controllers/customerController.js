const CustomerService = require('../service/customerService');


const createCustomer = (req, res) => {
  const customerData = req.body;

  CustomerService.createCustomer(customerData, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(201).send({ message: 'Customer created successfully, OTP sent to email.' });
  });
};


const getCustomer = (req, res) => {
  const custID_Nr = req.params.custID_Nr;

  CustomerService.getCustomerById(custID_Nr, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'Customer not found' });
    }
  });
};


const verifyOtp = (req, res) => {
  const { CustID_Nr, otp } = req.body;

  CustomerService.verifyOtp(CustID_Nr, otp, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    if (result) {
      res.status(200).send({ message: 'OTP verified successfully' });
    } else {
      res.status(400).send({ message: 'Invalid OTP' });
    }
  });
};

module.exports = {
  createCustomer,
  getCustomer,
  verifyOtp
};
