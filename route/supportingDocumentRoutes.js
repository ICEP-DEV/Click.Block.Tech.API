// routes/supportingDocumentRoutes.js
const express = require('express');
const router = express.Router();
const SupportingDocumentController = require('../controllers/supportingDocumentsController');

router.post('/create', SupportingDocumentController.create);
router.get('/:id', SupportingDocumentController.getById);
router.put('/update', SupportingDocumentController.update);
router.delete('/:id', SupportingDocumentController.delete);
router.get('/getAll', SupportingDocumentController.getAll);

module.exports = router;
