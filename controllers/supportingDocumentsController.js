const express = require('express');
const router = express.Router();
const SupportingDocumentService = require('../services/supportingDocumentService'); // Adjust path as needed

// Get a supporting document by ID
router.get('/documents/:id', async (req, res) => {
    const docId = req.params.id;
    try {
        const document = await SupportingDocumentService.getSupportingDocumentById(docId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching document' });
    }
});

// Update a supporting document
router.put('/documents/:id', async (req, res) => {
    const docId = req.params.id;
    const updatedDocument = req.body; // Assuming the updated document data is sent in the request body
    try {
        const result = await SupportingDocumentService.updateSupportingDocument(docId, updatedDocument);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json({ message: 'Document updated' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating document' });
    }
});

// Delete a supporting document
router.delete('/documents/:id', async (req, res) => {
    const docId = req.params.id;
    try {
        const result = await SupportingDocumentService.deleteSupportingDocument(docId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting document' });
    }
});

// Get all supporting documents
router.get('/documents', async (req, res) => {
    try {
        const documents = await SupportingDocumentService.getAllSupportingDocuments();
        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

module.exports = router;
