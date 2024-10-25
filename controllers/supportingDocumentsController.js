/*const SupportingDocumentsService = require('../service/supportingDocumentService');
const upload = require('../config/multerConfig');

// Upload a document
const uploadDocument = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        const { CustID_Nr } = req.body;
        const ID_Document = req.files['ID_Document'][0];
        const Selfie_With_ID = req.files['Selfie_With_ID'][0];

        const documentData = {
            CustID_Nr: CustID_Nr,
            ID_Document: ID_Document.filename,
            Selfie_With_ID: Selfie_With_ID.filename
        };

        const result = await SupportingDocumentsService.uploadDocument(documentData);
        res.status(200).send({ message: 'Document uploaded successfully', data: result });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Document upload failed' });
    }
};

// Get documents by customer ID
const getDocumentsByCustomer = async (req, res) => {
    try {
        const { customerID } = req.params;
        const documents = await SupportingDocumentsService.getDocumentsByCustomer(customerID);
        if (!documents) {
            return res.status(404).send({ message: 'No documents found for this customer' });
        }
        res.status(200).send(documents);
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error retrieving documents' });
    }
};

// Update a document
const updateDocument = async (req, res) => {
    try {
        const { CustID_Nr } = req.body;
        const ID_Document = req.files['ID_Document'][0];
        const Selfie_With_ID = req.files['Selfie_With_ID'][0];

        const documentData = {
            CustID_Nr: CustID_Nr,
            ID_Document: ID_Document.filename,
            Selfie_With_ID: Selfie_With_ID.filename
        };

        const result = await SupportingDocumentsService.updateDocument(documentData);
        res.status(200).send({ message: 'Document updated successfully', data: result });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Document update failed' });
    }
};

// Delete documents by customer ID
const deleteDocumentsByCustomer = async (req, res) => {
    try {
        const { customerID } = req.params;
        const result = await SupportingDocumentsService.deleteDocumentsByCustomer(customerID);
        res.status(200).send({ message: 'Documents deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Document deletion failed' });
    }
};

module.exports = {
    uploadDocument,
    getDocumentsByCustomer,
    updateDocument,
    deleteDocumentsByCustomer
};*/
