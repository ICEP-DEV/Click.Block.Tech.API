const CustomerService = require('../service/customerService');


const createCustomer = (req, res) => {
    const customerData = req.body;


    if (!customerData.CustID_Nr || !customerData.firstName || !customerData.lastName || !customerData.phoneNumber || !customerData.loginPin) {
        return res.status(400).send({ error: 'Customer ID, First Name, Last Name, Phone Number, and Remote Pin are required' });
    }

    CustomerService.createCustomer(customerData, (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(201).send(result);
    });
};

const updateCustomerStep = (req, res) => {
    const custID_Nr = req.params.custID_Nr;
    const stepData = req.body;

    CustomerService.updateCustomerStep(custID_Nr, stepData, (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(200).send(result);
    });
};


const verifyOtp = (req, res) => {
    const { Email, otp } = req.body;

    CustomerService.verifyOtp(Email, otp, (err, result) => {
        if (err) {
            return res.status(err.status || 500).send({ error: err.message });
        }
        res.status(200).send(result);
    });
};


// Get customer details by CustID_Nr
const getCustomer = (req, res) => {
    const custID_Nr = req.params.custID_Nr;

    CustomerService.getCustomerById(custID_Nr, (err, customer) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }
        res.status(200).send(customer);
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

module.exports = {
    createCustomer,
    updateCustomerStep,
    verifyOtp,
    getAccountID,
    getCustomer
};
