const CustomerService = require('../service/customerService');

const createCustomer = (req, res) => {
  //IN 
  const customerData = req.body;  

  //OUT
  CustomerService.createCustomer(customerData, (err, result) => {   
    if (err) {
      return res.status(500).send(err);
    }
      res.status(201).send(result);
  });

};


const getCustomer = (req, res) => {
  const custID_Nr = req.params.custID_Nr;
  
  CustomerService.getCustomerById(custID_Nr, (err, result) => {

    if (err) {
      return res.status(500).send(err);
    }
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send('Customer not found');
    }

  });
};


const verifyPhoneNumber = (req, res) => {
  const { phoneNumber } = req.body;

  CustomerService.sendVerificationCode(phoneNumber, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to send verification code', error: err });
    }
    res.status(200).send({ message: 'Verification code sent successfully', data: result });
  });
};

module.exports = { createCustomer, getCustomer, verifyPhoneNumber };
