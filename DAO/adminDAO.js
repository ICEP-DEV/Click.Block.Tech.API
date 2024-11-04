const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const AdminDAO = {
    create: (adminData, callback) => {
        // Hash the password
        bcrypt.hash(adminData.LoginPin, 10, (err, hashedPin) => {
            if (err) return callback({ status: 500, message: 'Error hashing password' });

            // Generate AdminID if not already generated
            adminData.AdminID = Admin.generateAdminID();
            adminData.LoginPin = hashedPin;

            const sql = 'INSERT INTO Admin SET ?';
            db.query(sql, adminData, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return callback({ status: 400, message: 'Duplicate entry for Admin' });
                    }
                    return callback({ status: 500, message: 'Database error' });
                }
                callback(null, result);
            });
        });
    },

    checkDuplicate: (email, callback) => {
        const sql = 'SELECT COUNT(*) AS count FROM Admin WHERE Email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) return callback({ status: 500, message: 'Database error' });
            callback(null, results[0].count > 0);
        });
    },

    login: (email, loginPin, callback) => {
        const sql = 'SELECT * FROM Admin WHERE Email = ?';
        db.query(sql, [email], (err, result) => {
            if (err) return callback({ status: 500, message: 'Database error' });

            if (result.length > 0) {
                bcrypt.compare(loginPin, result[0].LoginPin, (err, isMatch) => {
                    if (err) return callback({ status: 500, message: 'Error verifying PIN' });

                    if (isMatch) {
                        const admin = new Admin(
                            result[0].LastName,
                            result[0].FirstName,
                            result[0].PhoneNumber,
                            result[0].Address,
                            result[0].Email,
                            result[0].DateOfBirth,
                            result[0].LoginPin,
                            result[0].AdminID
                        );
                        callback(null, admin);
                    } else {
                        callback({ status: 401, message: 'Invalid credentials' }, null);
                    }
                });
            } else {
                callback({ status: 401, message: 'Invalid credentials' }, null);
            }
        });
    },

   




    // Method to fetch an admin by their ID
    getById: (adminID, callback) => {
        const sql = 'SELECT * FROM Admin WHERE AdminID = ?';

        db.query(sql, [adminID], (err, result) => {
            if (err) {
                console.error("Error retrieving admin:", err);
                return callback({ status: 500, message: 'Database error' });
            }

            if (result.length > 0) {
                const admin = new Admin(
                    result[0].AdminID,
                    result[0].LastName,
                    result[0].FirstName,
                    result[0].PhoneNumber,
                    result[0].Address,
                    result[0].Email,
                    result[0].DateOfBirth,
                    result[0].LoginPin
                );
                callback(null, admin);
            } else {
                callback(null, null);
            }
        });
    },

    // Method to update an admin's fields (excluding AdminID)
    updateFields: (adminID, updateData, callback) => {
        const sql = 'UPDATE Admin SET ? WHERE AdminID = ?';

        db.query(sql, [updateData, adminID], (err, result) => {
            if (err) {
                console.error("Error updating admin:", err);
                return callback({ status: 500, message: 'Database error' });
            }
            console.log("Update result:", result);
            callback(null, result);
        });
    },

    // Method to delete an admin by ID
    delete: (adminID, callback) => {
        const sql = 'DELETE FROM Admin WHERE AdminID = ?';

        db.query(sql, [adminID], (err, result) => {
            if (err) {
                console.error("Error deleting admin:", err);
                return callback({ status: 500, message: 'Database error' });
            }
            console.log("Delete result:", result);
            callback(null, result);
        });
    }
};

module.exports = AdminDAO;
