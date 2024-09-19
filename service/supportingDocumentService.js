const SupportingDocumentsDAO = require('../DAO/supportingDocumentDAO');
const SupportingDocument = require('../models/supportingDocuments');

const uploadDocument = async (documentData) => {
    try {
        const existingDocument = await SupportingDocumentsDAO.getByCustomerID(documentData.CustID_Nr);

        if (existingDocument) {
            return await updateDocument(documentData);
        } 
        
        const newDocument = new SupportingDocument(
            documentData.SuppDocsID, 
            documentData.CustID_Nr,
            documentData.ID_Document,
            documentData.Selfie_With_ID
        );

        if (!newDocument.isValid()) {
            throw new Error('Invalid supporting document data');
        }

        return await SupportingDocumentsDAO.createDocument(newDocument);
    } catch (err) {
        throw err; // Handle the error as needed
    }
};

const updateDocument = async (documentData) => {
    try {
        const updatedDocument = new SupportingDocument(
            documentData.SuppDocsID, 
            documentData.CustID_Nr,
            documentData.ID_Document,
            documentData.Selfie_With_ID
        );

        if (!updatedDocument.isValid()) {
            throw new Error('Invalid supporting document data');
        }

        return await SupportingDocumentsDAO.updateDocument(updatedDocument);
    } catch (err) {
        throw err; // Handle the error as needed
    }
};

const getDocumentsByCustomer = async (customerID) => {
    try {
        return await SupportingDocumentsDAO.getByCustomerID(customerID);
    } catch (err) {
        throw err; // Handle the error as needed
    }
};

const deleteDocumentsByCustomer = async (customerID) => {
    try {
        return await SupportingDocumentsDAO.deleteDocumentsByCustomer(customerID);
    } catch (err) {
        throw err; // Handle the error as needed
    }
};

module.exports = { uploadDocument, getDocumentsByCustomer, updateDocument, deleteDocumentsByCustomer };