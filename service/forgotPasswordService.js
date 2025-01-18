const otpMap = new Map(); // Temporarily store OTPs (use a database or Redis in production)
const tempCustomerData = new Map(); // Temporary customer storage (use a database in production)
const EmailService = require('./emailService'); // Email service
const CustomerDAO = require('../DAO/customerDAO');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Number of salt rounds for bcrypt

const generateAndSendOtp = async (Email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    otpMap.set(Email, otp); // Store OTP in memory (consider persistent storage in production)

    try {
        await EmailService.sendOtpEmail(Email, otp); // Send OTP via email
        console.log(`OTP sent to ${Email}`); // Log successful OTP sending
        return otp;
    } catch (error) {
        console.error(`Error sending OTP to ${Email}: ${error.message}`);
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

// Verify OTP provided by the customer using Promises
const verifyOtpFP = (Email, otp) => {
    return new Promise((resolve, reject) => {
        const storedOtp = otpMap.get(Email); // Retrieve OTP from the temporary storage (in-memory Map)

        if (!storedOtp) {
            console.error(`No OTP found for ${Email}`); // Log if OTP is not found for the provided email
            reject(new Error('OTP not found for this email')); // Reject with a specific error
            return; // Return early to prevent further execution
        }

        console.log(storedOtp , '  and   ', otp)
        if (storedOtp !== otp) {
            console.error(`Invalid OTP for ${Email}: Provided OTP is ${otp}, Stored OTP is ${storedOtp}`); // Log mismatch for debugging
            reject(new Error('Invalid OTP')); // Reject if OTP does not match
            return; // Return early to prevent further execution
        }

        console.log(`OTP verified successfully for ${Email}`); // Log successful verification

        // OTP is valid, clear it from memory
        otpMap.delete(Email); // Delete the OTP from the map after successful verification to prevent reuse
        console.log(`OTP cleared from map for ${Email}`); // Confirm OTP is cleared
        
        resolve(true); // Resolve the promise indicating OTP verification success
    });
};


// Update customer PIN using Promises
const updatePin = (custID_Nr, newPin) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Hash the new PIN
            const hashedPin = await bcrypt.hash(newPin, saltRounds);
            console.log(`Hashed PIN: ${hashedPin}`); // Log hashed PIN (avoid in production)

            // Update the hashed PIN in the database
            CustomerDAO.updatePin(custID_Nr, hashedPin, (err, response) => {
                if (err) {
                    console.error('Error updating PIN:', err.message);
                    reject(new Error(`Failed to update PIN: ${err.message}`));
                } else {
                    console.log(response.message);
                    resolve(response.message); // Resolve on success
                }
            });
        } catch (error) {
            console.error('Error hashing PIN:', error.message);
            reject(new Error(`Failed to hash PIN: ${error.message}`));
        }
    });
};

// Ensure CustomerDAO methods use Promises
CustomerDAO.getAll = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Customers';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                reject(err); // Reject on error
            }

            // Map results to Customer objects
            const customers = results.map((result) => ({
                CustID_Nr: result.CustID_Nr,      // Correct field name for Customer ID
                LastName: result.LastName,        // Correct field name for Last Name
                FirstName: result.FirstName,      // Correct field name for First Name
                PhoneNumber: result.PhoneNumber
            }));

            resolve(customers); // Resolve with customer data
        });
    });
};

const getCustomerEmail = (Email) => {
    return new Promise((resolve, reject) => {
        if (!Email) {
            return reject(new Error('Email is required'));
        }

        CustomerDAO.findCustomerByEmail(Email)
            .then((customer) => {
                if (!customer) {
                    return resolve(null); 
                }

                resolve(customer); 
            })
            .catch((err) => {
                reject(err); 
            });
    });
};


module.exports = {
    generateAndSendOtp,
    verifyOtpFP,
    updatePin, 
    getCustomerEmail
};
