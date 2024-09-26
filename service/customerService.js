const CustomerDAO = require('../DAO/customerDAO');
const EmailService = require('./emailService'); 
const crypto = require('crypto');
const otpMap = new Map(); // Store OTPs temporarily

const CustomerService = {
  createCustomer: (customerData, callback) => {
    // Check for required fields
    if (!customerData.CustID_Nr || !customerData.Email) {
      return callback(new Error('Customer ID and Email are required'));
    }

    // Check if the customer already exists
    CustomerDAO.getById(customerData.CustID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);

      if (existingCustomer) {
        return callback(new Error('Customer already exists'));
      }

      // Create the customer in the database
      CustomerDAO.create(customerData, (createErr, result) => {
        if (createErr) return callback(createErr);

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        otpMap.set(customerData.CustID_Nr, otp); // Store the OTP

        // Prepare the email options
        const emailOptions = {
          to: customerData.Email,
          subject: 'Your OTP for Nexis Bank Account Verification',
          text: `Your verification code is: ${otp}`,
        };

        // Send the OTP email
        EmailService.sendOtpEmail(emailOptions.to, otp)
          .then(() => {
            callback(null, { message: 'Customer created successfully. OTP sent to email.' });
          })
          .catch((emailErr) => {
            callback(new Error('Customer created, but failed to send OTP email: ' + emailErr.message));
          });
      });
    });
  },

  getCustomerById: (custID_Nr, callback) => {
    CustomerDAO.getById(custID_Nr, (err, customer) => {
      if (err) return callback(err);

      if (!customer) {
        return callback(new Error('Customer not found'));
      }

      callback(null, customer);
    });
  },

  verifyOtp: (CustID_Nr, otp, callback) => {
    const storedOtp = otpMap.get(CustID_Nr);

    if (!storedOtp) {
      return callback(new Error('OTP not found or expired'));
    }

    if (storedOtp === otp) {
      otpMap.delete(CustID_Nr); // Remove the OTP after verification
      callback(null, { message: 'OTP verified successfully' });
    } else {
      callback(new Error('Invalid OTP'));
    }
  },

  updateCustomer: (custID_Nr, updateData, callback) => {
    CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);

      if (!existingCustomer) {
        return callback(new Error('Customer not found'));
      }

      CustomerDAO.update(custID_Nr, updateData, (updateErr, result) => {
        if (updateErr) {
          return callback(updateErr);
        }
        callback(null, result);
      });
    });
  },

  deleteCustomer: (custID_Nr, callback) => {
    CustomerDAO.getById(custID_Nr, (err, existingCustomer) => {
      if (err) return callback(err);

      if (!existingCustomer) {
        return callback(new Error('Customer not found'));
      }

      CustomerDAO.delete(custID_Nr, (deleteErr, result) => {
        if (deleteErr) {
          return callback(deleteErr);
        }
        callback(null, result);
      });
    });
  },
};

module.exports = CustomerService;
