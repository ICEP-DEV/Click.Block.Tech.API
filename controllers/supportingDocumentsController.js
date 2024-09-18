
const SupportingDocumentService = require('../service/supportingDocumentService');

class SupportingDocumentController {
    async create(req, res) {

        try {
            const result = await SupportingDocumentService.createSupportingDocument(req.body);
            res.status(201).json({ message: 'Supporting document created', data: result });

        } catch (err) {
            res.status(400).json({ message: err.message });
        }

    }

    async getById(req, res) {

        try {
            const result = await SupportingDocumentService.getSupportingDocumentById(req.params.id);
            res.status(200).json(result);
        } catch (err) {
            res.status(404).json({ message: 'Supporting document not found' });
        }
        
    }

    async update(req, res) {
        try {
            const result = await SupportingDocumentService.updateSupportingDocument(req.body);
            res.status(200).json({ message: 'Supporting document updated', data: result });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            await SupportingDocumentService.deleteSupportingDocument(req.params.id);
            res.status(200).json({ message: 'Supporting document deleted' });
        } catch (err) {
            res.status(404).json({ message: 'Supporting document not found' });
        }
    }

    async getAll(req, res) {
        try {
            const result = await SupportingDocumentService.getAllSupportingDocuments();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new SupportingDocumentController();
