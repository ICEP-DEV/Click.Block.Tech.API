const SupportingDocumentsService = require('../service/supportingDocumentService');

const uploadDocument = async (req, res) => {
    const documentData = req.body;

    try {
        const result = await SupportingDocumentsService.uploadDocument(documentData);
        res.status(200).send({ message: 'Document uploaded successfully', data: result });
    } catch (err) {
        res.status(500).send({ message: 'Invalid ID' });
    }
};

const updateDocument = async (req, res) => {
    const documentData = req.body;

    try {
        const result = await SupportingDocumentsService.updateDocument(documentData);
        res.status(200).send({ message: 'Document updated successfully', data: result });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const getDocumentsByCustomer = async (req, res) => {
    const customerID = req.params.customerID;

    try {
        const result = await SupportingDocumentsService.getDocumentsByCustomer(customerID);
        res.status(200).send({ data: result });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const deleteDocumentsByCustomer = async (req, res) => {
    const customerID = req.params.customerID;

    try {
        const result = await SupportingDocumentsService.deleteDocumentsByCustomer(customerID);
        res.status(200).send({ message: 'Documents deleted successfully', data: result });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { uploadDocument, updateDocument, getDocumentsByCustomer, deleteDocumentsByCustomer };