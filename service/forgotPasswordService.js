const otpMap = new Map(); // Temporarily store OTPs (use a database or Redis in production)
const tempCustomerData = new Map(); // Temporary customer storage (use a database in production)
const EmailService = require('./emailService'); // Email service
const CustomerDAO = require('../DAO/customerDAO');
const crypto = require('crypto');

// Generate and send OTP to customer email
exports.generateAndSendOtp = async (Email) => {
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

// Verify OTP provided by the customer
exports.verifyOtpFP = async (Email, otp) => {
    const storedOtp = otpMap.get(Email); // Retrieve OTP from memory
    console.log(`Stored OTP for ${Email}: ${storedOtp}`); // Log the OTP to see what is stored in the map

    if (!storedOtp) {
        console.error(`No OTP found for ${Email}`); // Log if OTP is not found
        throw new Error('OTP not found for this email');
    }

    if (storedOtp !== otp) {
        console.error(`Invalid OTP for ${Email}: Provided OTP is ${otp}, Stored OTP is ${storedOtp}`); // Log if OTPs do not match
        throw new Error('Invalid OTP');
    }

    // const customerData = Array.from(tempCustomerData.values())
    // .find(data => data.Email.toLowerCase() === Email.toLowerCase());
    
    // if (!customerData) {
    //     console.error(`Customer data not found for email: ${Email}`); // Log if customer data is not found
    //     throw new Error('Customer data not found for email.');
    // }

    console.log(`OTP verified successfully for ${Email}`); // Log successful OTP verification

    // OTP is valid, clear it from memory
    otpMap.delete(Email); // OTP cleared after use
    console.log(`OTP cleared from map for ${Email}`); // Confirm OTP is cleared
    return true;
};

// Update customer PIN (with async/await for better error handling)
exports.updatePin = async (custID_Nr, newPin) => {
    try {
        const response = await CustomerDAO.updatePin(custID_Nr, newPin); // Assuming updatePin returns a Promise
        console.log(response.message);
        return response.message; // Return success message or data
    } catch (err) {
        console.error(err.message);
        throw new Error(`Failed to update PIN: ${err.message}`);
    }
};
