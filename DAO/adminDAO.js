const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Alert = require('../models/alert');
const Location = require('../models/location');

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
                const admin = {
                    _AdminID: result[0].AdminID,
                    _LastName: result[0].LastName,
                    _FirstName: result[0].FirstName,
                    _PhoneNumber: result[0].PhoneNumber,
                    _Address: result[0].Address,
                    _Email: result[0].Email,
                    _DateOfBirth: result[0].DateOfBirth,
                    _LoginPin: result[0].LoginPin
                };
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
    },

    getAllAlerts: (callback) =>{
        const sql = 'SELECT * FROM alert ';

        db.query(sql, (err, results) => {
          if (err) {
            console.error('Error retrieving alerts:', err);
            return callback({ status: 500, message: 'Database error' });
          }
          if(results.length > 0){
            const alerts = results.map(result => new Alert(
                result.AlertID,
                result.CustID_Nr,
                result.AlertType,
                result.SentDate,
                result.LocationID,
                result.Receiver,
                result.Message
            ))
            callback(null, alerts);
          }else{
            callback(null, null);
          }
          
          
        });
      },
      getLocationByID: (locationID, callback)=>{
        const sql = 'SELECT * FROM location WHERE LocationID = ?';
        db.query(sql, [locationID], (err, result) =>{
          if(err){
            callback(err, null);
          }else{
            if(result.length > 0){
              const location = new Location(
              result[0].LocationID,
              result[0].StreetAddress,
              result[0].Suburb,
              result[0].City,
              result[0].Province,
              result[0].PostalCode,
              result[0].Country,
              result[0].latitude,
              result[0].longitude,
              );
              callback(null, location);
            } else {
              callback(null, null);  
            }
          }
        });
       },

       updateCustomerPanicStatus(custIdNr, callback) {
        const query = `UPDATE Customer SET PanicButtonStatus = 0 WHERE CustID_Nr = ?`;
    
        db.query(query, [custIdNr], (error, results) => {
            if (error) {
                console.error('Error updating PanicButtonStatus:', error);
                return callback(error, null);
            }
            callback(null, { message: 'PanicButtonStatus updated to 1 for customer' });
        });
    }
    
    
};

module.exports = AdminDAO;
