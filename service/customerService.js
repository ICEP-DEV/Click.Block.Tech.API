const CustomerDAO = require('../DAO/customerDAO');
const EmailService = require('./emailService');
const crypto = require('crypto');
const otpMap = new Map();
const tempCustomerData = new Map(); // Temporary storage for customer data

const CustomerService = {
    createCustomer: (customerData, callback) => {
        console.log('Creating customer with data:', customerData);
        
        // Store temporary customer data using CustID_Nr as the key
        tempCustomerData.set(customerData.CustID_Nr, { ...customerData });
        
        console.log('Temporary customer data after creation:', tempCustomerData);
        callback(null, { message: 'Customer created successfully, proceed to the next step.' });
    },

    updateCustomerStep: (custID_Nr, stepData, callback) => {
        console.log(`Updating customer step for CustID_Nr: ${custID_Nr} with data:`, stepData);
        
        const existingData = tempCustomerData.get(custID_Nr);

        if (!existingData) {
            console.error(`Customer with CustID_Nr: ${custID_Nr} not found.`);
            return callback(new Error('Customer ID not found'));
        }

        console.log('Existing customer data before update:', existingData);

        // Merge the existing data with the new step data
        const updatedData = { ...existingData, ...stepData };
        
        // Store updated data back using CustID_Nr
        tempCustomerData.set(custID_Nr, updatedData);

        console.log('Updated customer data after step update:', updatedData);

        // If the email is provided, send OTP
        if (stepData.Email) {
            console.log('Email provided, generating OTP...');
            const otp = crypto.randomInt(100000, 999999).toString();
            otpMap.set(stepData.Email, otp);
            const emailOptions = {
                to: stepData.Email,
                subject: 'Your OTP for Nexis Bank Account Verification',
                text: `Your verification code is: ${otp}`,
            };

            EmailService.sendOtpEmail(emailOptions.to, otp)
                .then(() => {
                    console.log(`OTP sent to ${stepData.Email}`);
                    callback(null, { message: 'OTP sent to email. Please verify.' });
                })
                .catch((emailErr) => {
                    console.error('Failed to send OTP email:', emailErr);
                    callback(new Error('Failed to send OTP email: ' + emailErr.message));
                });
        } else {
            callback(null, { message: 'Customer data updated successfully for this step.' });
        }
    },

    verifyOtp: (Email, otp, callback) => {
        console.log(`Verifying OTP for email: ${Email} with OTP: ${otp}`);
        
        const storedOtp = otpMap.get(Email);

        if (!storedOtp) {
            console.error('OTP not found or expired for email:', Email);
            return callback(new Error('OTP not found or expired'));
        }

        if (storedOtp === otp) {
            console.log('OTP verified successfully.');

            // Find the customer by Email to extract their CustID_Nr
            const customerDataArray = Array.from(tempCustomerData.values());
            const customerData = customerDataArray.find(data => data.Email === Email);

            if (!customerData) {
                console.error('Customer data not found for the provided email:', Email);
                return callback(new Error('Customer data not found for the provided email.'));
            }

            console.log('Customer data found for OTP verification:', customerData);

            // Proceed with creating the customer in the database
            CustomerDAO.create(customerData, (createErr, result) => {
                if (createErr) {
                    console.error('Error creating customer in the database:', createErr);
                    return callback(createErr);
                }

                otpMap.delete(Email); // Clear the OTP
                tempCustomerData.delete(customerData.CustID_Nr); // Clear temporary data
                
                console.log('Customer successfully registered and temporary data cleared for:', customerData.CustID_Nr);
                callback(null, { message: 'OTP verified successfully, customer registered.' });
            });
        } else {
            console.error('Invalid OTP provided for email:', Email);
            callback(new Error('Invalid OTP'));
        }
    },
};

module.exports = CustomerService;
