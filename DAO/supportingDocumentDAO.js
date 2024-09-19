const db = require('../config/config');

const createDocument = (document) => {
    const query = 'INSERT INTO supportingdocuments (SuppDocsID, CustID_Nr, ID_Document, Selfie_With_ID) VALUES (?, ?, ?, ?)';
    const values = [document.suppDocsID, document.custIDNr, document.idDocument, document.selfieWithID];

    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const updateDocument = (document) => {
    const query = 'UPDATE supportingdocuments SET ID_Document = ?, Selfie_With_ID = ? WHERE CustID_Nr = ?';
    const values = [document.idDocument, document.selfieWithID, document.custIDNr];

    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const getByCustomerID = (customerID) => {
    const query = 'SELECT * FROM supportingdocuments WHERE CustID_Nr = ?';

    return new Promise((resolve, reject) => {
        db.query(query, [customerID], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]); // Assuming a single document per customer
        });
    });
};

const deleteDocumentsByCustomer = (customerID) => {
    const query = 'DELETE FROM supportingdocuments WHERE CustID_Nr = ?';

    return new Promise((resolve, reject) => {
        db.query(query, [customerID], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = { createDocument, updateDocument, getByCustomerID, deleteDocumentsByCustomer };