const bcrypt = require('bcrypt');  // Add bcrypt
const CustomerDAO = require('../DAO/customerDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const EmailService = require('./emailService');
const crypto = require('crypto');

const otpMap = new Map();
const tempCustomerData = new Map();

const SALT_ROUNDS = 10; // bcrypt salt rounds

const CustomerService = {
    createCustomer: (customerData, callback) => {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not provided or not a function');
        }
        console.log('Creating customer with data:', customerData);

        // Hash the password using bcrypt before storing
        bcrypt.hash(customerData.loginPin, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return callback({ status: 500, message: 'Error hashing password' });
            }

            // Replace the loginPin with the hashed password
            customerData.loginPin = hashedPassword;

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

            // Create the customer first (with hashed password)
            CustomerDAO.create(customerData, (err, customerResult) => {
                if (err) {
                    if (err.status === 400) {
                        return callback({ status: 400, message: 'Email already exists' });
                    } else {
                        console.error('Failed to create customer:', err);
                        return callback({ status: 500, message: 'Database error' });
                    }
                }

                const customerID = customerData.CustID_Nr;

                console.log('Customer created with ID:', customerID);

                const newBankAccount = {
                    AccountNr: generateRandomAccountNumber(),
                    AccountType: 'Savings',
                    Balance: 0,
                    CreationDate: new Date(),
                    isActive: 1
                };

                BankAccountDAO.create(newBankAccount, (accountErr, bankAccountResult) => {
                    if (accountErr) {
                        console.error('Error creating bank account:', accountErr);
                        return callback({ status: 500, message: 'Failed to create bank account' });
                    }

                    const bankAccountID = bankAccountResult.insertId;

                    CustomerDAO.updateFields(customerID, { AccountID: bankAccountID }, (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('Error updating customer with AccountID:', updateErr);
                            return callback({ status: 500, message: 'Failed to update customer with AccountID' });
                        }

                        otpMap.delete(Email);
                        tempCustomerData.delete(customerData.CustID_Nr);

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
    return Date.now().toString();
}

module.exports = CustomerService;
