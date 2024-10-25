/*const express = require('express');
const router = express.Router();
const supportingDocumentsController = require('../controllers/supportingDocumentsController');
const upload = require('../config/multerConfig');

// Route for uploading a document
router.post('/upload', upload.fields([
    { name: 'ID_Document', maxCount: 1 },
    { name: 'Selfie_With_ID', maxCount: 1 }
]), supportingDocumentsController.uploadDocument);

// Route for getting documents by customer ID
router.get('/:customerID', supportingDocumentsController.getDocumentsByCustomer);

// Route for updating a document
router.put('/update', upload.fields([
    { name: 'ID_Document', maxCount: 1 },
    { name: 'Selfie_With_ID', maxCount: 1 }
]), supportingDocumentsController.updateDocument);

// Route for deleting documents by customer ID
router.delete('/:customerID', supportingDocumentsController.deleteDocumentsByCustomer);

module.exports = router;*/
