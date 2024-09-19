const SupportingDocumentsDAO = require('../DAO/supportingDocumentDAO');

const uploadDocument = (documentData, callback) => {
  if (!documentData.CustID_Nr || !documentData.ID_Document || !documentData.Selfie_With_ID) {
    return callback(new Error('CustID_Nr, ID_Document, and Selfie_With_ID are required.'));
  }

  SupportingDocumentsDAO.createDocument(documentData, callback);
};

const getDocumentsByCustomer = (customerID, callback) => {
  SupportingDocumentsDAO.getByCustomerID(customerID, callback);
};

module.exports = { uploadDocument, getDocumentsByCustomer };
