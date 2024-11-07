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
        res.sendStatus(200).send(result);
    });
};

//This method is for comparing the Alert PIN with Login PIN and vise versa
const comparePINS = (req, res) =>{
    const accountNr = req.params.AccountNr;
    const pin = req.params.Pin;
    const bcrypt = require('bcryptjs');

    var accountID = 0;
    CustomerService.getbyAccountNumber(accountNr,(err, customerByAccNr) => {
        if(err){
          return res.status(500).send(err);
        }
        if(customerByAccNr){
        accountID = customerByAccNr.AccountID;
        //getting customer using the account ID
        CustomerService.getbyAccountID(accountID, (err, customer) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
    
            if (customer) {
                //matching input password with the hashed password
           
                bcrypt.compare(pin, customer._LoginPin, (err, result) => {
                    if (err) {
                        // Handle error
                        console.error('Error comparing passwords:', err);
                        return;
                    }
             
                    if (result) {
                    // Passwords match, authentication successful
                    console.log('PINS match');
                    res.status(200).send(result);
                    } else {
                    // Passwords don't match, authentication failed
                    console.log('PINS dont match');
                    res.status(200).send(result);
                    }
                });
                
            }else{
                res.status(404).send({ error: 'Customer not found' });
            }
           
        });
        }else{
          res.status(200).send(null);
        }
      });

}

const comparePINSAlert = (req, res) =>{
    const accountNr = req.params.AccountNr;
    const pin = req.params.Pin;
    const bcrypt = require('bcryptjs');

    var accountID = 0;
    CustomerService.getbyAccountNumber(accountNr,(err, customerByAccNr) => {
        if(err){
          return res.status(500).send(err);
        }
        if(customerByAccNr){
        accountID = customerByAccNr.AccountID;
        //getting customer using the account ID
        CustomerService.getbyAccountID(accountID, (err, customer) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
    
            if (customer) {
                //matching input password with the hashed password
           
                bcrypt.compare(pin, customer._AlertPin, (err, result) => {
                    if (err) {
                        // Handle error
                        console.error('Error comparing passwords:', err);
                        return;
                    }
             
                    if (result) {
                    // Passwords match, authentication successful
                    console.log('PINS match');
                    res.status(200).send(result);
                    } else {
                    // Passwords don't match, authentication failed
                    console.log('PINS dont match');
                    res.status(200).send(result);
                    }
                });
                
            }else{
                res.status(404).send({ error: 'Customer not found' });
            }
           
        });
        }else{
          res.status(200).send(null);
        }
      });

}
const getCustomerByAccNr = (req, res) => {
    const accountNr = req.params.AccountNr;
    const loginPin = req.params.LoginPin;
    const bcrypt = require('bcryptjs');
    
    var accountID = 0;
    CustomerService.getbyAccountNumber(accountNr,(err, customerByAccNr) => {
        if(err){
          return res.status(500).send(err);
        }
        if(customerByAccNr){
        accountID = customerByAccNr.AccountID;
        //getting customer using the account ID
        CustomerService.getbyAccountID(accountID, (err, customer) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
    
            if (customer) {
                //matching input password with the hashed password
           
                bcrypt.compare(loginPin, customer._LoginPin, (err, result) => {
                    if (err) {
                        // Handle error
                        console.error('Error comparing passwords:', err);
                        return;
                    }
             
                    if (result) {
                    // Passwords match, authentication successful
                    console.log('Passwords match! User authenticated.');
                    res.status(200).send(customer);
                    } else {
                    // Passwords don't match, authentication failed
                    console.log('Passwords do not match! Authentication failed.');
                    res.status(200).send(result);
                    }
                });
                
            }else{
                res.status(404).send({ error: 'Customer not found' });
            }
           
        });
        }else{
          res.status(200).send(null);
        }
      });
      
      


};
// Get customer details by CustID_Nr
const getCustomer = (req, res) => {
    const custID_Nr = req.params.custID_Nr;

    CustomerService.getCustomerById(custID_Nr, (err, customer) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        if (customer) {
            res.status(200).send(customer);
        }else{
            res.status(404).send({ error: 'Customer not found' });
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

// Verify old PIN before updating
const verifyOldPin = (req, res) => {
    const { custID_Nr, oldPin, pinKey } = req.body;
 
    CustomerService.verifyPin(custID_Nr, oldPin, pinKey, (err, result) => {
        if (err) {
            return res.status(err.status || 500).send({ error: err.message });
        }
        res.status(200).send(result);
    });
};
 
//This method is for creating new Alert PIN
const createAlertPin = (req, res) => {
    const custID_Nr = req.params.custID_Nr; // Get customer ID from the request params
    const newAlertPIN =  req.body; // Get oldPin and pinKey from the request body
 
    CustomerService.createCustomerPIN(custID_Nr, newAlertPIN, (err, result) => {
        if (err) {
            console.error('Error in updateCustomerDetails:', err); // Log database update error
            return res.status(500).json({ error: 'Failed to update customer', message: err.message });
        }

        console.log('Alert PIN created successfully for ID:', custID_Nr); // Log success
        res.status(200).json({ message: 'Alert PIN created successfully', success: result });
    });
};
//This method i for updating customer details
const updatePanicStatus = (req, res) =>{
    const custID_Nr = req.params.custID_Nr;
    const newPanicStatus = req.body;
    CustomerService.updateCustomer(custID_Nr,newPanicStatus,(err, result) =>{
        if(err){
            console.error('Error updating Panic button status:', err);
            return res.status(500).json({error: 'Failed to update customer Panic Button Status'});
        }
        console.log('Panic Button Status updated successfully for ID: ', custID_Nr);
        res.status(200).json({message: 'Panic Button Status updated'});
    });
}
 

//This method is for Updating PINs 
const updateCustomerDetails = (req, res) => {
    const custID_Nr = req.params.custID_Nr; // Get customer ID from the request params
    const { updateData, oldPin, pinKey } = req.body; // Get oldPin and pinKey from the request body
 
    console.log('Starting customer update for ID:', custID_Nr, 'with data:', updateData);
 
    // Verify the old PIN first
    CustomerService.verifyPin(custID_Nr, oldPin, pinKey, (err, verificationResult) => {
        if (err || !verificationResult.success) {
            console.error('Old PIN verification failed:', err || verificationResult.message);
            return res.status(400).json({ error: 'Old PIN verification failed', message: err ? err.message : verificationResult.message });
        }
 
        // If old PIN is verified, proceed to update the customer details
        CustomerService.updateCustomerDetailsService(custID_Nr, updateData, oldPin, pinKey, (err, result) => {
            if (err) {
                console.error('Error in updateCustomerDetails:', err); // Log database update error
                return res.status(500).json({ error: 'Failed to update customer', message: err.message });
            }
 
            console.log('Customer update successful for ID:', custID_Nr); // Log success
            res.status(200).json({ message: 'Customer updated successfully', success: result });
        });
    });
};
 
// New function to retrieve account statistics
const getAccountStatistics = (req, res) => {
    CustomerService.getAccountStatistics((err, stats) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(200).send(stats);
    });
};


module.exports = {
    createCustomer,
    updateCustomerStep,
    verifyOtp,
    getAccountID,
    getCustomer,
    getCustomerByAccNr,
    createAlertPin,
    updateCustomerDetails,
    verifyOldPin,
    comparePINS,
    comparePINSAlert,
    updatePanicStatus,
    getAccountStatistics

};

