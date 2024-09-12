class SupportingDocument {
    constructor(SuppDocsID, CustID_Nr, ID_Document, Selfie_With_ID) {
        this._SuppDocsID = SuppDocsID;
        this._CustID_Nr = CustID_Nr;
        this._ID_Document = ID_Document;
        this._Selfie_With_ID = Selfie_With_ID; 
    }

    // ===============================================================================================
    //                                             Setters
    // ===============================================================================================

    set SuppDocsID(id) {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error('SuppDocsID must be a positive number.');
        }
        this._SuppDocsID = id;
    }

    set CustID_Nr(id) {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error('CustID_Nr must be a positive number.');
        }
        this._CustID_Nr = id;
    }

    set ID_Document(document) {
        if (typeof document !== 'string' || document.trim() === '') {
            throw new Error('ID_Document must be a non-empty string.');
        }
        this._ID_Document = document;
    }

    set Selfie_With_ID(selfie) {
        if (typeof selfie !== 'string' || selfie.trim() === '') {
            throw new Error('Selfie_With_ID must be a non-empty string.');
        }
        this._Selfie_With_ID = selfie;
    }

    // ===============================================================================================
    //                                          Getters
    // ===============================================================================================

    get SuppDocsID() {
        return this._SuppDocsID;
    }

    get CustID_Nr() {
        return this._CustID_Nr;
    }

    get ID_Document() {
        return this._ID_Document;
    }

    get Selfie_With_ID() {
        return this._Selfie_With_ID;
    }
   // Method to display SupportingDocument details (excluding sensitive info)
   displayDocumentDetails() {
    return {
        SuppDocsID: this._SuppDocsID,
        CustID_Nr: this._CustID_Nr,
        ID_Document: this._ID_Document
        // Exclude Selfie_With_ID if it's considered sensitive
    };
}
} 


module.exports = SupportingDocument;
