const CustomerService = require('../service/customerService');

const createCustomer = (req, res) => {
  console.log(req.body);
  const customerData = req.body;
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
const  getAccountID =  (req,res)=>{
const accountNr = req.params.AccountNr;
  CustomerService.getbyAccountNumber(accountNr,(err, result) => {
    if(err){
      return res.status(500).send(err);
    }
    if(result){
      res.status(200).send(result);
    }else{
      res.status(404).send('Account not found).');
    }
  });
};

module.exports = { createCustomer, getCustomer, getAccountID};
