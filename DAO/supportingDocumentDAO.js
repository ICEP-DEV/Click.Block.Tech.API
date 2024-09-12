const db = require('../config/config'); // Adjust the path as needed

class SupportingDocumentDAO {
    // Create a new supporting document
    createSupportingDocument(doc, callback) {
        const query = 'INSERT INTO supportingdocuments (CustID_Nr, ID_Document, Selfie_With_ID) VALUES (?, ?, ?)';
        db.query(query, [doc.CustID_Nr, doc.ID_Document, doc.Selfie_With_ID], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.insertId);
        });
    }

    // Get a supporting document by ID
    getSupportingDocumentById(docId, callback) {
        const query = 'SELECT * FROM supportingdocuments WHERE SuppDocsID = ?';
        db.query(query, [docId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    }



    // Update a supporting document
    updateSupportingDocument(docId, doc, callback) {
        const query = 'UPDATE supportingdocuments SET CustID_Nr = ?, ID_Document = ?, Selfie_With_ID = ? WHERE SuppDocsID = ?';
        db.query(query, [doc.CustID_Nr, doc.ID_Document, doc.Selfie_With_ID, docId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows);
        });
    }

    // Delete a supporting document
    deleteSupportingDocument(docId, callback) {
        const query = 'DELETE FROM supportingdocuments WHERE SuppDocsID = ?';
        db.query(query, [docId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows);
        });
    }

    // Get all supporting documents
    getAllSupportingDocuments(callback) {
        const query = 'SELECT * FROM supportingdocuments';
        db.query(query, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }

      // Get documents by customer ID
      getDocumentsByCustomerId(custId, callback) {
        const query = 'SELECT * FROM supportingdocuments WHERE CustID_Nr = ?';
        db.query(query, [custId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
    
}

// Export the SupportingDocumentDAO class
module.exports = new SupportingDocumentDAO();
