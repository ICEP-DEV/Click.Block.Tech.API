const express = require('express');
const router = express.Router();
const supportingDocumentsController = require('../controllers/supportingDocumentsController');

router.post('/upload', supportingDocumentsController.uploadDocument);
router.get('/:customerID', supportingDocumentsController.getDocumentsByCustomer);
router.put('/update', supportingDocumentsController.updateDocument);
router.delete('/:customerID', supportingDocumentsController.deleteDocumentsByCustomer);

module.exports = router;
