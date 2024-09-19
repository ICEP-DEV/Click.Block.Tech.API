const SupportingDocumentsService = require('../service/supportingDocumentService');

const uploadDocument = (req, res) => {
  const documentData = req.body;

  SupportingDocumentsService.uploadDocument(documentData, (err, result) => {
    if (err) {
      return res.status(500).send(err.message || 'Error uploading document.');
    }
    res.status(201).send(result);
  });
};

const getDocumentsByCustomer = (req, res) => {
  const customerID = req.params.customerID;

  SupportingDocumentsService.getDocumentsByCustomer(customerID, (err, documents) => {
    if (err) {
      return res.status(500).send(err.message || 'Error fetching documents.');
    }
    if (!documents.length) {
      return res.status(404).send('No documents found for this customer.');
    }
    res.status(200).send(documents);
  });
};

module.exports = { uploadDocument, getDocumentsByCustomer };
