class BankCard {
    constructor(CardID, AccountID, CardNumber, CardType, ExpirationDate, CVV, IsActive) {
      this._CardID = CardID;              // Unique identifier for the card
      this._AccountID = AccountID;        // Foreign key referencing the account
      this._CardNumber = CardNumber;      // Unique card number
      this._CardType = CardType;          // Type of card (e.g., Debit, Credit)
      this._ExpirationDate = ExpirationDate; // Card expiration date
      this._CVV = CVV;                    // Security code for the card
      this._IsActive = IsActive;          // Indicates if the card is active
    }
  
    //_____________________SETTERS_____________________________________
  
    set CardID(value) {
      throw new Error('CardID cannot be modified');
    }
  
    set AccountID(value) {
      if (typeof value !== 'number') {
        throw new Error('AccountID must be a number');
      }
      this._AccountID = value;
    }
  
    set CardNumber(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('CardNumber must be a valid string');
      }
      this._CardNumber = value;
    }
  
    set CardType(value) {
      const allowedTypes = ['Debit', 'Credit', 'Prepaid'];
      if (!allowedTypes.includes(value)) {
        throw new Error('Invalid card type');
      }
      this._CardType = value;
    }
  
    set ExpirationDate(value) {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new Error('ExpirationDate must be a valid date');
      }
      this._ExpirationDate = value;
    }
  
    set CVV(value) {
      if (typeof value !== 'string' || value.length !== 3) {
        throw new Error('CVV must be a 3-digit string');
      }
      this._CVV = value;
    }
  
    set IsActive(value) {
      if (typeof value !== 'boolean') {
        throw new Error('IsActive must be a boolean');
      }
      this._IsActive = value;
    }
  
    //_____________________GETTERS_____________________________________
  
    get CardID() {
      return this._CardID;
    }
  
    get AccountID() {
      return this._AccountID;
    }
  
    get CardNumber() {
      return this._CardNumber;
    }
  
    get CardType() {
      return this._CardType;
    }
  
    get ExpirationDate() {
      return this._ExpirationDate;
    }
  
    get CVV() {
      return this._CVV;
    }
  
    get IsActive() {
      return this._IsActive;
    }
  }
  
  module.exports = BankCard;
  