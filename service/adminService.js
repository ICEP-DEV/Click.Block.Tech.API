require('dotenv').config();
const bcrypt = require('bcryptjs');
const AdminDAO = require('../DAO/adminDAO');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY; // Use environment variable for production

const AdminService = {
    createAdmin: (adminData, callback) => {
        AdminDAO.checkDuplicate(adminData.Email, (err, isDuplicate) => {
            if (err) {
                return callback(err);
            }
            if (isDuplicate) {
                return callback({ status: 400, message: 'Email already exists' });
            }
            AdminDAO.create(adminData, callback);
        });
    },

    login: (email, loginPin, callback) => {
        if (!email || !loginPin) {
            return callback({ status: 400, message: 'Email and login PIN are required' });
        }

        AdminDAO.login(email, loginPin, (err, admin) => {
            if (err) {
                console.error('Login error:', err);
                return callback(err);
            }

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
    }
};

module.exports = AdminService;
