// services/SupportingDocumentService.js
const SupportingDocumentDAO = require('../DAO/supportingDocumentDAO');
const SupportingDocument = require('../models/supportingDocuments');

class SupportingDocumentService {
    async createSupportingDocument(data) {
        const supportingDocument = new SupportingDocument(
            null, // suppDocsID is auto-generated
            data.custIDNr,
            data.idDocument,
            data.selfieWithID
        );

        if (!supportingDocument.isValid()) {
            console.log(data.custIDNr + "\t" + data.idDocument + "\t" + data.selfieWithID);
            throw new Error('Invalid supporting document data here');
        }

        return await SupportingDocumentDAO.create(supportingDocument);
    }


    async getSupportingDocumentById(suppDocsID) {
        return await SupportingDocumentDAO.getById(suppDocsID);
    }

    async updateSupportingDocument(data) {
        const supportingDocument = new SupportingDocument(data.suppDocsID, null, data.idDocument, data.selfieWithID);

        if (!supportingDocument.isValid()) {
            throw new Error('Invalid supporting document data');
        }

        return await SupportingDocumentDAO.update(supportingDocument);
    }

    async deleteSupportingDocument(suppDocsID) {
        return await SupportingDocumentDAO.delete(suppDocsID);
    }

   // async getAllSupportingDocuments() {
       // return await SupportingDocumentDAO.getAll();
    }


module.exports = new SupportingDocumentService();
