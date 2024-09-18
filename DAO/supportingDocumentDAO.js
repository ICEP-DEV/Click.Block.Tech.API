const db = require('../config/config');

class SupportingDocumentDAO {
    async create(supportingDocument) {
        const { custIDNr, idDocument, selfieWithID } = supportingDocument;
        const query = 'INSERT INTO supportingdocuments(CustID_Nr, ID_Document, Selfie_With_ID) VALUES (?, ?, ?)';
       
        const result = await db.query(query, [custIDNr, idDocument, selfieWithID]);

        return result;
    }

    async getById(suppDocsID) {
        const query = 'SELECT * FROM supportingdocuments WHERE SuppDocsID = ?';
        const result = await db.query(query, [suppDocsID]);
        return result[0];
    }

    async update(supportingDocument) {
        const { suppDocsID, idDocument, selfieWithID } = supportingDocument;
        const query = 'UPDATE supportingdocuments SET ID_Document = ?, Selfie_With_ID = ? WHERE SuppDocsID = ?';
        const result = await db.query(query, [idDocument, selfieWithID, suppDocsID]);
        return result;
    }

    async delete(suppDocsID) {
        const query = 'DELETE FROM supportingdocuments WHERE SuppDocsID = ?';
        const result = await db.query(query, [suppDocsID]);
        return result;
    }

    async getAll() {
        const query = 'SELECT * FROM supportingdocuments';
        const result = await db.query(query);
        return result;
    }
}

module.exports = new SupportingDocumentDAO();
