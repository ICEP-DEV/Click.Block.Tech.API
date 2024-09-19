const express = require('express');
const router = express.Router();
const supportingDocumentsController = require('../controllers/supportingDocumentsController');

router.post('/upload', supportingDocumentsController.uploadDocument);
router.get('/:customerID', supportingDocumentsController.getDocumentsByCustomer);

module.exports = router;
