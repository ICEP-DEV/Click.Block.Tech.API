/*const SupportingDocumentsDAO = require('../DAO/supportingDocumentDAO');
const SupportingDocument = require('../models/supportingDocuments');

// Upload or Update Document
const uploadDocument = async (documentData) => {
    try {
        const existingDocument = await SupportingDocumentsDAO.getByCustomerID(documentData.CustID_Nr);

        if (existingDocument) {
            const updatedDocument = new SupportingDocument(
                existingDocument.suppDocsID,
                documentData.CustID_Nr,
                documentData.ID_Document,
                documentData.Selfie_With_ID
            );
            
            if (!updatedDocument.isValid()) {
                throw new Error('Invalid supporting document data');
            }

            return await SupportingDocumentsDAO.updateDocument(updatedDocument);
        } else {
            const newDocument = new SupportingDocument(
                null, // SuppDocsID, assuming auto-increment
                documentData.CustID_Nr,
                documentData.ID_Document,
                documentData.Selfie_With_ID
            );

            if (!newDocument.isValid()) {
                throw new Error('Invalid supporting document data');
            }

            return await SupportingDocumentsDAO.createDocument(newDocument);
        }
    } catch (err) {
        throw err;
    }
};

// Get Documents by Customer ID
const getDocumentsByCustomer = async (CustID_Nr) => {
    try {
        return await SupportingDocumentsDAO.getByCustomerID(CustID_Nr);
    } catch (err) {
        throw err;
    }
};

// Update Document
const updateDocument = async (documentData) => {
    try {
        const document = new SupportingDocument(
            null,
            documentData.CustID_Nr,
            documentData.ID_Document,
            documentData.Selfie_With_ID
        );
        if (!document.isValid()) {
            throw new Error('Invalid document data');
        }

        return await SupportingDocumentsDAO.updateDocument(document);
    } catch (err) {
        throw err;
    }
};

// Delete Documents by Customer ID
const deleteDocumentsByCustomer = async (CustID_Nr) => {
    try {
        return await SupportingDocumentsDAO.deleteDocumentsByCustomer(CustID_Nr);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    uploadDocument,
    getDocumentsByCustomer,
    updateDocument,
    deleteDocumentsByCustomer
};*/
