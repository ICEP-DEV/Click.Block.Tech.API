const SupportingDocumentDAO = require('../DAO/supportingDocumentDAO'); // Adjust the path as needed

class SupportingDocumentService {
    // Create a new supporting document
    static createSupportingDocument(newDocument) {
        return new Promise((resolve, reject) => {
            SupportingDocumentDAO.createSupportingDocument(newDocument, (err, insertId) => {
                if (err) {
                    return reject(new Error('Error creating document'));
                }
                resolve(insertId);
            });
        });
    }

    // Get a supporting document by ID
    static getSupportingDocumentById(docId) {
        return new Promise((resolve, reject) => {
            SupportingDocumentDAO.getSupportingDocumentById(docId, (err, document) => {
                if (err) {
                    return reject(new Error('Error fetching document'));
                }
                resolve(document);
            });
        });
    }

    // Update a supporting document
    static updateSupportingDocument(docId, updatedDocument) {
        return new Promise((resolve, reject) => {
            SupportingDocumentDAO.updateSupportingDocument(docId, updatedDocument, (err, result) => {
                if (err) {
                    return reject(new Error('Error updating document'));
                }
                resolve(result);
            });
        });
    }

    // Delete a supporting document
    static deleteSupportingDocument(docId) {
        return new Promise((resolve, reject) => {
            SupportingDocumentDAO.deleteSupportingDocument(docId, (err, result) => {
                if (err) {
                    return reject(new Error('Error deleting document'));
                }
                resolve(result);
            });
        });
    }

    // Get all supporting documents
    static getAllSupportingDocuments() {
        return new Promise((resolve, reject) => {
            SupportingDocumentDAO.getAllSupportingDocuments((err, documents) => {
                if (err) {
                    return reject(new Error('Error fetching documents'));
                }
                resolve(documents);
            });
        });
    }
}

module.exports = SupportingDocumentService;
