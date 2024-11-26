require('dotenv').config();
const bcrypt = require('bcryptjs');
const AdminDAO = require('../DAO/adminDAO');
const CustomerDAO = require('../DAO/customerDAO'); // Add this to access the CustomerDAO
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const AdminService = {
    createAdmin: (adminData, callback) => {
        AdminDAO.checkDuplicate(adminData.Email, (err, isDuplicate) => {
            if (err) return callback(err);
            if (isDuplicate) return callback({ status: 400, message: 'Email already exists' });

            AdminDAO.create(adminData, callback);
        });
    },

    login: (email, loginPin, callback) => {
        if (!email || !loginPin) return callback({ status: 400, message: 'Email and login PIN are required' });

        AdminDAO.login(email, loginPin, (err, admin) => {
            if (err) return callback(err);

            const token = jwt.sign({ adminId: admin.AdminID, role: 'admin' }, SECRET_KEY, {
                expiresIn: '1h'
            });

            callback(null, { success: true, message: 'Login successful', token, admin });
        });
    },

    getAdminById: (adminID, callback) => {
        AdminDAO.getById(adminID, callback);
    },

    updateAdmin: (adminID, updateData, callback) => {
        if (updateData.LoginPin) {
            // Hash the new LoginPin before updating
            bcrypt.hash(updateData.LoginPin, 10, (err, hashedPin) => {
                if (err) {
                    return callback({ status: 500, message: 'Error hashing password' });
                }
                updateData.LoginPin = hashedPin; // Update to hashed password
                AdminDAO.updateFields(adminID, updateData, callback);
            });
        } else {
            AdminDAO.updateFields(adminID, updateData, callback);
        }
    },

    deleteAdmin: (adminID, callback) => {
        AdminDAO.delete(adminID, callback);
    },

    getAllAlerts: (callback) => {
        AdminDAO.getAllAlerts(callback);
    },

    getLocationByID: (locationID, callback) => {
        AdminDAO.getLocationByID(locationID, callback);
    },

    updateCustomerPanicStatus: (custIdNr, callback) => {
        AdminDAO.updateCustomerPanicStatus(custIdNr, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    }
};

module.exports = AdminService;
