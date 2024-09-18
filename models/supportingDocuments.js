
class SupportingDocument {
    constructor(suppDocsID, custIDNr, idDocument, selfieWithID) {
        this.suppDocsID = suppDocsID;
        this.custIDNr = custIDNr;
        this.idDocument = idDocument;
        this.selfieWithID = selfieWithID;
    }

    // isValid() {
    //     return this.custIDNr && this.idDocument && this.selfieWithID;
    // }
    
}

module.exports = SupportingDocument;
