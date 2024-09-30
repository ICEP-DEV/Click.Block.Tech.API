const db = require('../config/config');

const createDocument = (document) => {
    const query = 'INSERT INTO supportingdocument (CustID_Nr, ID_Document, Selfie_With_ID) VALUES (?, ?, ?)';
    const values = [document.custIDNr, document.idDocument, document.selfieWithID];

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
    const query = 'UPDATE supportingdocument SET ID_Document = ?, Selfie_With_ID = ? WHERE CustID_Nr = ?';
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
    const query = 'SELECT * FROM supportingdocument WHERE CustID_Nr = ?';
    
    return new Promise((resolve, reject) => {
        db.query(query, [customerID], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]); // Return the first matching record
        });
    });
};

const deleteDocumentsByCustomer = (customerID) => {
    const query = 'DELETE FROM supportingdocument WHERE CustID_Nr = ?';

    return new Promise((resolve, reject) => {
        db.query(query, [customerID], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    createDocument,
    updateDocument,
    getByCustomerID,
    deleteDocumentsByCustomer
};
