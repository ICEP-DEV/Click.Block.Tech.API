const CustomerService = require('../service/customerService');

// Create a new customer (Step 1)
const createCustomer = (req, res) => {
    const customerData = req.body;

    // Validate the input fields for step 1
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

// Update customer data in steps (Step 2 or 3)
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

// Verify OTP for email verification
const verifyOtp = (req, res) => {
    const { Email, otp } = req.body;

    CustomerService.verifyOtp(Email, otp, (err, result) => {
        if (err) {
          console.log(Email+ " ___________"+ otp)
            return res.status(500).send({ error: err.message });
        }
        res.status(200).send(result);
    });
};

// Get customer details by customer ID
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

module.exports = {
    createCustomer,
    updateCustomerStep,
    verifyOtp,
    getCustomer,  // Add this to exports
};
