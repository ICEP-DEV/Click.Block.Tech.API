const db = require('../config/config');

const createDocument = (documentData, callback) => {
  const sql = 'INSERT INTO SupportingDocuments SET ?';

  db.query(sql, documentData, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });

};

const getByCustomerID = (customerID, callback) => {
  const sql = 'SELECT * FROM SupportingDocuments WHERE CustID_Nr = ?';
  db.query(sql, [customerID], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = { createDocument, getByCustomerID };
