const db = require('../config/config');
const ContactMeMessage = require('../models/contactMeMessage');

const ContactMeMessageDAO = {
  create: (newMessage, callback) => {
    const sql = `
      INSERT INTO contactmemessage (CustID_Nr, FullNames, PhoneNumber, Email, MessageDescription, Status, AdminID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [newMessage.CustID_Nr, newMessage.FullNames, newMessage.PhoneNumber, newMessage.Email, newMessage.MessageDescription, newMessage.Status, newMessage.AdminID], (err, result) => {
      if (err) return callback(new Error('Failed to create message: ' + err.message));
      callback(null, result.insertId);
    });
  },

  getById: (MessageID, callback) => {
    const sql = 'SELECT * FROM contactmemessage WHERE MessageID = ?';
    db.query(sql, [MessageID], (err, result) => {
      if (err) return callback(new Error('Failed to retrieve message: ' + err.message));
      callback(null, result[0] ? new ContactMeMessage(...Object.values(result[0])) : null);
    });
  },

  updateStatus: (MessageID, Status, callback) => {
    const sql = 'UPDATE contactmemessage SET Status = ? WHERE MessageID = ?';
    db.query(sql, [Status, MessageID], (err, result) => {
      if (err) return callback(new Error('Failed to update message: ' + err.message));
      callback(null, result.affectedRows > 0);
    });
  },

  delete: (MessageID, callback) => {
    const sql = 'DELETE FROM contactmemessage WHERE MessageID = ?';
    db.query(sql, [MessageID], (err, result) => {
      if (err) return callback(new Error('Failed to delete message: ' + err.message));
      callback(null, result.affectedRows > 0);
    });
  },

  getByCustomerID: (CustID_Nr, callback) => {
    const sql = 'SELECT * FROM contactmemessage WHERE CustID_Nr = ?';
    db.query(sql, [CustID_Nr], (err, results) => {
      if (err) return callback(new Error('Failed to retrieve messages: ' + err.message));
      callback(null, results.map(row => new ContactMeMessage(...Object.values(row))));
    });
  },

  getAll: (callback) => {
    const sql = 'SELECT * FROM contactmemessage';
    db.query(sql, (err, results) => {
      if (err) return callback(new Error('Failed to retrieve all messages: ' + err.message));
      // Directly map results to ContactMeMessage instances, or return an empty array if no results
      callback(null, results.length > 0 ? results.map(row => new ContactMeMessage(...Object.values(row))) : []);
    });
  }
};

module.exports = ContactMeMessageDAO;

