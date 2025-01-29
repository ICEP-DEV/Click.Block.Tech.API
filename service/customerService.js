const bcrypt = require('bcryptjs');
const CustomerDAO = require('../DAO/customerDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const BankCardDAO = require('../DAO/bankCardDAO');
const Transaction = require('../DAO/transactionDAO');
const ContactMeMessage = require('../DAO/contactMeMessageDAO');
const EmailService = require('./emailService');
const crypto = require('crypto');
const AlertPinLogDAO = require('../DAO/alertPinLogDAO'); 

const otpMap = new Map();
const tempCustomerData = new Map();  

const SALT_ROUNDS = 10; 

const CustomerService = {
    createCustomer: (customerData, callback) => {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not provided or not a function');
        }
        console.log('Creating customer with data:', customerData);

       //Check here for the bcrypt for update 
        bcrypt.hash(customerData.loginPin, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return callback({ status: 500, message: 'Error hashing password' });
            }

           
            customerData.loginPin = hashedPassword;

          
            tempCustomerData.set(customerData.CustID_Nr, customerData);

            console.log('Temporary customer data after creation:', tempCustomerData);
            callback(null, { message: 'Customer data stored. Proceed to the next step.' });
        });
    },


    getbyAccountNumber: (accountNum, callback) => {
        if (!accountNum) return callback(new Error('Account Number is required'));
     CustomerDAO.getbyAccountNumber(accountNum, callback);
        
    },
    getbyAccountID: (accountID, callback) =>{
        if(!accountID) return callback(new Error('Account ID ir required'));
        CustomerDAO.getCustomerByAccID(accountID,callback);
    },
    getAccIDByCardNum:(cardNum,callback)=>{
        if(!cardNum)return callback(new Error('Card Number is required'));
        CustomerDAO.getAccountIDbyCardNum(cardNum,callback);
    },

    getCustomerById: (custID_Nr, callback) => {
        if (!custID_Nr) return callback(new Error('Customer ID is required'));

        CustomerDAO.getById(custID_Nr, callback);
    },


    updateCustomer: (custID_Nr, updateData, callback) => {
        if (!custID_Nr || !updateData) return callback(new Error('Customer ID and update data are required'));

        CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
            if (err) return callback(err);
            if (!existingCustomer || existingCustomer.length === 0) {
                return callback(new Error('Customer not found'));
            }

            CustomerDAO.update(custID_Nr, updateData, callback);
        });
    },
    verifyPin: (custID_Nr, oldPin, pinKey, callback) => {
        console.log(`Verifying PIN for customer ID: ${custID_Nr}, PIN type: ${pinKey}`);
        
        CustomerDAO.getById(custID_Nr, (err, customer) => {
            if (err) {
                console.error('Database error:', err);
                return callback({ status: 500, message: 'Database error' });
            }
            if (!customer) {
                console.error('Customer not found:', custID_Nr);
                return callback({ status: 404, message: 'Customer not found' });
            }
            
            const pinField = pinKey === 'loginPin' ? 'LoginPin' : 'AlertPin';
            const hashedPin = customer[pinField];
            
            if (!hashedPin) {
                console.error(`No ${pinField} found for this customer`);
                return callback({ status: 400, message: `No ${pinField} found for this customer` });
            }
            
            bcrypt.compare(oldPin, hashedPin, (err, isMatch) => {
                if (err) {
                    console.error('Error verifying PIN:', err);
                    return callback({ status: 500, message: 'Error verifying PIN' });
                }
                
                if (isMatch) {
                    console.log('Old PIN verified successfully for customer:', custID_Nr);
    
                    // Log AlertPin usage if it's AlertPin verification
                    if (pinKey === 'alertPin') {
                        AlertPinLogsDAO.create({ CustID_Nr: custID_Nr, Action: pinKey === 'loginPin' ? 'login' : 'transaction', TriggerDate: new Date() }, (logErr) => {
                            if (logErr) {
                                console.error('Failed to log AlertPin usage:', logErr);
                            }
                        });
                    }
    
                    return callback(null, { success: true, message: 'Old PIN verified' });
                } else {
                    console.log('Old PIN is incorrect for customer:', custID_Nr);
                    return callback({ status: 400, message: 'Old PIN is incorrect' });
                }
            });
        });
    },
    
// Updated Update Customers with Old PIN Verification

updateCustomerDetailsService : (custID_Nr, updateData, oldPin, pinKey, callback) => {
    console.log('Verifying old PIN for customer:', custID_Nr);
 
    // First, verify the old PIN before proceeding with the update
    CustomerService.verifyPin(custID_Nr, oldPin, pinKey, (err, verificationResult) => {
        if (err || !verificationResult.success) {
            console.error('Old PIN verification failed:', err || verificationResult.message);
            return callback(err || { status: 400, message: 'Old PIN verification failed' });
        }
 
        // Proceed to hash and update the new PIN(s)
        const promises = [];
 
        // Check if LoginPin needs to be updated and hash it
        if (updateData.loginPin) {
            const loginPinPromise = new Promise((resolve, reject) => {
                bcrypt.hash(updateData.loginPin, SALT_ROUNDS, (err, hashedLoginPin) => {
                    if (err) {
                        console.error('Error hashing LoginPin:', err); // Log bcrypt hash error
                        return reject(err);
                    }
                    updateData.loginPin = hashedLoginPin; // Replace the plain text PIN with the hashed one
                    resolve();
                });
            });
            promises.push(loginPinPromise);
        }
 
        // Check if AlertPin needs to be updated and hash it
        if (updateData.alertPin) {
            const alertPinPromise = new Promise((resolve, reject) => {
                bcrypt.hash(updateData.alertPin, SALT_ROUNDS, (err, hashedAlertPin) => {
                    if (err) {
                        console.error('Error hashing AlertPin:', err); // Log bcrypt hash error
                        return reject(err);
                    }
                    updateData.alertPin = hashedAlertPin; // Replace the plain text PIN with the hashed one
                    resolve();
                });
            });
            promises.push(alertPinPromise);
        }
 
        // Wait for all PIN updates to complete before updating the customer details
        Promise.all(promises)
            .then(() => {
                CustomerDAO.update(custID_Nr, updateData, (err, result) => {
                    if (err) {
                        console.error('Error updating customer:', err); // Log database update error
                        return callback(err);
                    }
                    if (result.affectedRows === 0) {
                        console.error('Customer not found or no changes made:', custID_Nr); // Log if no changes were made
                        return callback(new Error('Customer not found or no changes made'));
                    }
                    callback(null, { success: true, message: 'Customer details updated successfully' });
                });
            })
            .catch(err => {
                console.error('Error hashing PIN(s):', err); // Log error for hashing failure
                return callback({ status: 500, message: 'Error hashing PIN(s)' });
            });
    });
},

//end of updaATE


    //Updated Update Customers
     
    createCustomerPIN: (custID_Nr, updateData, callback) => {
        if (!custID_Nr || !updateData) return callback(new Error('Customer ID and update data are required'));
    
        // Check if there is a new LoginPin or AlertPin to be updated
        const promises = [];
    
        if (updateData.loginPin) {
            // Hash the new LoginPin before updating
            const loginPinPromise = new Promise((resolve, reject) => {
                   
                bcrypt.hash(updateData.loginPin, SALT_ROUNDS, (err, hashedLoginPin) => {
                    if (err) return reject(err);
                    updateData.loginPin = hashedLoginPin; // Replace the loginPin with the hashed version
                    resolve();
                });
            });
            promises.push(loginPinPromise);
        }
    
        if (updateData.alertPin) {
            console.log(updateData.alertPin)
            // Hash the new AlertPin before updating
            const alertPinPromise = new Promise((resolve, reject) => {
                bcrypt.hash(updateData.alertPin, SALT_ROUNDS, (err, hashedAlertPin) => {
                    if (err) return reject(err);
                    updateData.alertPin = hashedAlertPin; // Replace the alertPin with the hashed version
                    resolve();
                });
            });
            promises.push(alertPinPromise);
        }
    
        // Wait for all hashing promises to complete
        Promise.all(promises)
            .then(() => {
                CustomerDAO.update(custID_Nr, updateData, (err, result) => {
                    if (err) return callback(err);
                    if (result.affectedRows === 0) {
                        return callback(new Error('Customer not found or no changes made'));
                    }
                    callback(null, result);
                });
            })
            .catch(err => {
                console.error('Error hashing pin:', err);
                return callback({ status: 500, message: 'Error hashing pin' });
            });
    },
    
/// end of Updated Update Customers 

    deleteCustomer: (custID_Nr, callback) => {
        if (!custID_Nr) return callback(new Error('Customer ID is required'));

        CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
            if (err) return callback(err);
            if (!existingCustomer || existingCustomer.length === 0) {
                return callback(new Error('Customer not found'));
            }

            CustomerDAO.delete(custID_Nr, callback);
        });
    },

    updateCustomerStep: (custID_Nr, stepData, callback) => {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not provided or not a function');
        }

        const existingData = tempCustomerData.get(custID_Nr);

        if (!existingData) {
            return callback({ status: 404, message: 'Customer ID not found' });
        }

        const updatedData = { ...existingData, ...stepData };
        tempCustomerData.set(custID_Nr, updatedData);

        if (stepData.Email) {
            const otp = crypto.randomInt(100000, 999999).toString();
            otpMap.set(stepData.Email, otp);
            //Sending OTP
            EmailService.sendOtpEmail(stepData.Email, otp)
                .then(() => callback(null, { message: 'OTP sent. Verify it.' }))
                .catch(emailErr => callback({ status: 500, message: 'Failed to send OTP: ' + emailErr.message }));
        } else {
            callback(null, { message: 'Customer data updated successfully.' });
        }
    },

    verifyOtp: (Email, otp, callback) => {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not provided or not a function');
        }

        try {
            const storedOtp = otpMap.get(Email);
            if (storedOtp !== otp) {
                return callback({ status: 400, message: 'Invalid OTP' });
            }

            const customerData = Array.from(tempCustomerData.values()).find(data => data.Email === Email);
            if (!customerData) {
                return callback({ status: 404, message: 'Customer data not found for email.' });
            }

          
            CustomerDAO.create(customerData, (err, customerResult) => {
                if (err) {
                    if (err.status === 400) {
                        return callback({ status: 400, message: 'account already exists' });
                    } else {
                        console.error('Failed to create customer:', err);
                        return callback({ status: 500, message: 'Database error' });
                    }
                }

                const customerID = customerData.CustID_Nr;
                console.log('Customer created with ID:', customerID);
                const cardExpirDate = new Date();
                cardExpirDate.setFullYear(cardExpirDate.getFullYear() + 7);

                // Format the balance with a space as the thousands separator
         const formattedBalance = new Intl.NumberFormat('en-US', { useGrouping: true }).format(500000);
                const newBankAccount = {
                    AccountNr: generateRandomAccountNumber(),
                    AccountType: 'Savings',
                    ExpirationDate: cardExpirDate,
                    Balance: formattedBalance,
                    CreationDate: new Date(),
                    isActive: 1,


                };

                BankAccountDAO.create(newBankAccount, (accountErr, bankAccountResult) => {
                    if (accountErr) {
                        console.error('Error creating bank account:', accountErr);
                        return callback({ status: 500, message: 'Failed to create bank account' });
                    }

                    const bankAccountID = bankAccountResult.id;
                    console.log('Bank Account created with ID:', bankAccountID); 

                    //creating a bankcard
                    const newBankCard = {AccountID: bankAccountID}
                    if (!newBankCard.AccountID) {
                        return callback(new Error('Account ID is required'));
                      }
                  
                      // Randomize last 12 digits of card number (first 4 digits are 5478)
                      const randomCardNumber = '5478' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
                  
                      // Randomize CVV (3-digit number)
                      const randomCVV = Math.floor(100 + Math.random() * 900).toString();
                  
                      // Randomize expiration date (1-5 years in the future)
                      const currentDate = new Date();
                      const futureYear = currentDate.getFullYear() + Math.floor(Math.random() * 5) + 1;
                      const randomExpirationDate = new Date(futureYear, currentDate.getMonth(), currentDate.getDate());
                  
                      // Setting defaults for missing fields
                      newBankCard.CardNumber = randomCardNumber;
                      newBankCard.CVV = randomCVV;
                      newBankCard.ExpirationDate = randomExpirationDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                      newBankCard.IsActive = 1;
                      newBankCard.CardType = 'debit';
                     // Active by default
                  
                      BankCardDAO.create(newBankCard, (err, cardID) => {
                        if (err) {
                          return callback(new Error('Failed to create bank card: ' + err.message));
                        }
                        callback(null, cardID); // Return the new CardID
                      });
                  

                    
                    CustomerDAO.updateFields(customerID, { AccountID: bankAccountID }, (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('Error updating customer with AccountID:', updateErr);
                            return callback({ status: 500, message: 'Failed to update customer with AccountID' });
                        }

                        otpMap.delete(Email);
                        tempCustomerData.delete(customerData.CustID_Nr);

                        console.log('Customer and bank account successfully created:', customerData.CustID_Nr);
    
                    });
                
                });
               
            });
        } catch (error) {
            console.error('Unexpected error during OTP verification:', error);
            callback({ status: 500, message: 'Unexpected server error' });
        }
    },

    //function that calls each of these DAO methods for admin dashboard stats

    getAccountStatistics: (callback) => {
        const stats = {};

        BankAccountDAO.countAllAccounts((err, total) => {
            if (err) return callback(err);
            stats.TotalAccounts = total;

            BankAccountDAO.countActiveAccounts((err, active) => {
                if (err) return callback(err);
                stats.ActiveAccounts = active;

                BankAccountDAO.countFrozenAccounts((err, frozen) => {
                    if (err) return callback(err);
                    stats.FrozenAccounts = frozen;

                    BankAccountDAO.countDeactivatedAccounts((err, deactivated) => {
                        if (err) return callback(err);
                        stats.DeactivatedAccounts = deactivated;

                        BankAccountDAO.countRestoredAccounts((err, restored) => {
                            if (err) return callback(err);
                            stats.RestoredAccounts = restored;

                            callback(null, stats);
                        });
                    });
                });
            });
        });
    },
    updateLastLogin: (custID_Nr, callback) => {
        if (!custID_Nr) return callback(new Error('Customer ID is required'));
        
        // Call the DAO method to update the last login timestamp
        CustomerDAO.updateLastLogin(custID_Nr, (err, result) => {
            if (err) {
                console.error('Error updating last login:', err); // Log the error
                return callback(err); // Return the error via callback
            }
    
            if (result.affectedRows === 0) {
                console.error('No customer found with the provided ID:', custID_Nr); 
                return callback(new Error('No customer found with the provided ID'));
            }
    
            console.log('Last login updated successfully for customer:', custID_Nr);
            callback(null, { success: true, message: 'Last login updated successfully' });
        });
    },

    
    getCustomerInfo: (custID_Nr, callback) => {
        CustomerDAO.getCustomerDetails(custID_Nr, (err, customerDetails) => {
          if (err) return callback(err, null);
          if (!customerDetails) return callback(null, null);
    
          // Fetch messages and transactions in parallel
          CustomerDAO.getMessagesByCustomerId(custID_Nr, (err, messages) => {
            if (err) return callback(err, null);
    
            CustomerDAO.getTransactionsByCustomerId(custID_Nr, (err, transactions) => {
              if (err) return callback(err, null);
    
              // Build the response object
              const response = {
                name: `${customerDetails.firstName} ${customerDetails.lastName}`,
                email: customerDetails.email,
                phoneNumber: customerDetails.phoneNumber,
                address: customerDetails.address,
                registeredOn: customerDetails.registeredOn,
                lastLogin: customerDetails.lastLogin,
                requests: messages,
                recentActivityLog: transactions
              };
    
              callback(null, response);
            });
          });
        });
      },

     getCustomerDetailsWithAlerts: (AccountNr, callback) => {
  CustomerDAO.getCustomerDetailsWithAlerts(AccountNr, (err, response) => {
    if (err) {
      return callback(err);
    }
    callback(null, response);
  });
},

    
    };
    

function generateRandomAccountNumber() {
    return Date.now().toString();
}


module.exports = CustomerService;
