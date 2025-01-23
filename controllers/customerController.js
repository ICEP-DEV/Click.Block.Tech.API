const CustomerService = require('../service/customerService');
const ForgotPinService = require('../service/forgotPasswordService');
const transactionService = require('../service/transactionService');
const ContactMeMessageService = require('../service/contactMeMessageService');

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
                    console.log('Remote PINS match');
                     // Update LastLogin timestamp
                     CustomerService.updateLastLogin(customer.CustID_Nr, (err, updateResult) => {
                        if (err) {
                            console.error('Failed to update LastLogin:', err.message);
                        } else {
                            console.log('LastLogin updated successfully');
                        }
                    });
                    res.status(200).send(result);
                    } else {
                    // Passwords don't match, authentication failed
                    console.log('Remote PINS dont match');
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
                    
                    console.log('Alert PINS match');

                    // Update LastLogin timestamp
                    CustomerService.updateLastLogin(customer.CustID_Nr, (err, updateResult) => {
                        if (err) {
                            console.error('Failed to update LastLogin:', err.message);
                        } else {
                            console.log('LastLogin updated successfully');
                        }
                    });

                    res.status(200).send(result);
                    } else {
                    // Passwords don't match, authentication failed
                    console.log('Alert PINS dont match');
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
const getCustByAccID = (req, res)=>{
    const accountID = req.params.AccountID;
    CustomerService.getbyAccountID(accountID, (err, customer) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(200).send(customer);
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

const getCustomerEmail = async (req, res) => {
    const email = req.params.Email; // Ensure 'Email' is consistently named (camelCase is more common in JS)


    try {
        const customerByEmail = await ForgotPinService.getCustomerEmail(email);

        if (!customerByEmail) {
            return res.status(404).send({ message: 'Customer not found' });
        }
    
        return res.status(200).send(customerByEmail);
    } catch (err) {
        console.error('Error fetching customer:', err); // Log error for debugging
        return res.status(500).send({ error: 'An error occurred', details: err });
    }
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

const updateLastLogin = (req, res) => {
    const custID_Nr = req.params.custID_Nr;

    CustomerService.updateLastLogin(custID_Nr, (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(200).send({ message: 'LastLogin updated successfully', result });
    });
};


//Fetching Customer Details


const getCustomerInfo = (req, res) => {
    const { custID_Nr } = req.params;

    if (!custID_Nr) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    CustomerService.getCustomerInfo(custID_Nr, (err, customerInfo) => {
      if (err) {
        console.error(`Error fetching customer info for ID ${custID_Nr}:`, err);
        return res.status(500).json({ error: 'An error occurred while fetching customer details.' });
      }

      if (!customerInfo) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.status(200).json(customerInfo);
    });
  };

  const updatePin = async (req, res) => {
    const { custID_Nr, newPin } = req.body;

    if (!custID_Nr || !newPin) {
        return res.status(400).json({ message: 'custID_Nr and new PIN are required.' });
    }

    try {
        await ForgotPinService.updatePin(custID_Nr, newPin); // Service updates the PIN
        res.status(200).json({ message: 'PIN updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendOtp = async (req, res) => {
    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const otp = await ForgotPinService.generateAndSendOtp(Email); // Service generates and sends OTP
        res.status(200).json({ message: 'OTP sent. Verify it.', otp }); // Remove `otp` in production for security
    } catch (error) {
        res.status(500).json({ message: `Failed to send OTP: ${error.message}` });
    }
};

const verifyOtpFP = async (req, res) => {
    const { Email, otp } = req.body;

    try {
        await ForgotPinService.verifyOtpFP(Email, otp); // Service verifies OTP
        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        res.status(400).json({ message: `Failed to verify OTP: ${error.message}` });
    }
};

//Get Customer Details With Associated Alert Triggers

const getCustomerDetails = (req, res) => {
    const custID_Nr = req.params.custID_Nr;
 
    // Fetch customer details, alert pin logs, and recent activations in a single call
    CustomerService.getCustomerDetailsWithAlerts(custID_Nr, (err, response) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
 
      res.status(200).json(response);
    });
  };



module.exports = {
    verifyOtpFP,
    sendOtp,
    updatePin,
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
    getAccountStatistics,
    getCustByAccID,
    updateLastLogin,
    getCustomerInfo,
    getCustomerEmail,
    getCustomerDetails
};

