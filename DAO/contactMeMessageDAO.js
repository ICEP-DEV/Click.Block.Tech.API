const db = require('../config/config');

const ContactMeMessageDAO = {
  create: (newMessage, callback) => {
    const sql = `
      INSERT INTO contactmemessage 
      (CustID_Nr, FullNames, PhoneNumber, Email, MessageDescription, Status, AdminID, SentTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      newMessage.CustID_Nr,
      newMessage.FullNames,
      newMessage.PhoneNumber,
      newMessage.Email,
      newMessage.MessageDescription,
      newMessage.Status || 'pending',
      newMessage.AdminID || null,
      new Date() // Sets the SentTime to the current date and time
    ], (err, result) => {
      if (err) return callback(new Error('Failed to create message: ' + err.message));
      callback(null, result.insertId);
    });
  },

  getById: (MessageID, callback) => {
    const sql = 'SELECT * FROM contactmemessage WHERE MessageID = ?';
    db.query(sql, [MessageID], (err, result) => {
      if (err) return callback(new Error('Failed to retrieve message: ' + err.message));
      callback(null, result.length ? result[0] : null);
    });
  },


  updateStatus: (MessageID, status, callback) => {
    const sql = 'UPDATE contactmemessage SET Status = ? WHERE MessageID = ?';
    db.query(sql, [status, MessageID], (err, result) => {
      if (err) return callback(new Error('Failed to update status: ' + err.message));
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

  getAll: (callback) => {
   
    const sql = 'SELECT * FROM contactmemessage';
    db.query(sql, (err, results) => {
      
      if (err) return callback(new Error('Failed to retrieve messages: ' + err.message));
      console.log('Callback Results:', results);
      callback(null, results);
      
    });
  }
  
};





module.exports = ContactMeMessageDAO;
