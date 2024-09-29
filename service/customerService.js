const CustomerDAO = require('../DAO/customerDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const EmailService = require('./emailService');
const crypto = require('crypto');

const otpMap = new Map();
const tempCustomerData = new Map();

const CustomerService = {
    createCustomer: (customerData, callback) => {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not provided or not a function');
        }
        console.log('Creating customer with data:', customerData);

        // Check for duplicate CustID_Nr
        CustomerDAO.checkDuplicate(customerData.CustID_Nr, (err, isDuplicate) => {
            if (err) {
                return callback(err); // Handle any database errors
            }

            if (isDuplicate) {
                return callback({ status: 400, message: 'Customer ID already exists. Please use a unique CustID_Nr.' });
            }

            // Temporarily store customer data
            tempCustomerData.set(customerData.CustID_Nr, customerData);
            console.log('Temporary customer data after creation:', tempCustomerData);
            callback(null, { message: 'Customer data stored. Proceed to the next step.' });
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

            // Create the customer first (without AccountID)
            CustomerDAO.create(customerData, (err, customerResult) => {
                if (err) {
                    if (err.status === 400) {
                        // Handle duplicate email error
                        return callback({ status: 400, message: 'Email already exists' });
                    } else {
                        console.error('Failed to create customer:', err);
                        return callback({ status: 500, message: 'Database error' });
                    }
                }

                // Use the provided CustID_Nr as the customer ID
                const customerID = customerData.CustID_Nr; // Get the CustID_Nr from the input data

                // Log the customer ID for debugging
                console.log('Customer created with ID:', customerID);

                // Create the bank account without expecting accountData from the controller
                const newBankAccount = {
                    AccountNr: generateRandomAccountNumber(),
                    AccountType: 'Savings', // Default value
                    Balance: 0,             // Default value
                    CreationDate: new Date(),
                    isActive: 1
                };

                BankAccountDAO.create(newBankAccount, (accountErr, bankAccountResult) => {
                    if (accountErr) {
                        console.error('Error creating bank account:', accountErr);
                        return callback({ status: 500, message: 'Failed to create bank account' });
                    }

                    const bankAccountID = bankAccountResult.insertId;

                    // Log the bank account ID for debugging
                    console.log('Bank account created with ID:', bankAccountID);

                    // Update the customer with the newly created AccountID
                    CustomerDAO.updateFields(customerID, { AccountID: bankAccountID }, (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('Error updating customer with AccountID:', updateErr);
                            return callback({ status: 500, message: 'Failed to update customer with AccountID' });
                        }

                        // Log the result of the update query for debugging
                        console.log('Customer updated with AccountID:', updateResult);

                        // Successfully created customer and bank account
                        otpMap.delete(Email); // Clear the OTP
                        tempCustomerData.delete(customerData.CustID_Nr); // Clear temporary data

                        console.log('Customer and bank account successfully created:', customerData.CustID_Nr);
                        callback(null, { message: 'OTP verified, customer and bank account created.' });
                    });
                });
            });
        } catch (error) {
            console.error('Unexpected error during OTP verification:', error);
            callback({ status: 500, message: 'Unexpected server error' });
        }
    }
};

function generateRandomAccountNumber() {
    return Date.now().toString();  // Simple account number generator using the current timestamp
}

module.exports = CustomerService;
