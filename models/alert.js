class Alert {
    constructor(AlertID, CustID_Nr, AlertType, SentDate, LocationID, Receiver, Message) {
      this._AlertID = AlertID;          
      this._CustID_Nr = CustID_Nr;      
      this._AlertType = AlertType;      
      this._SentDate = SentDate;        
      this._LocationID = LocationID;    
      this._Receiver = Receiver;        
      this._Message = Message;          
    }
  
    //_____________________SETTERS_____________________________________
  
    set AlertID(value) {
      throw new Error('AlertID cannot be modified');
    }
  
    set CustID_Nr(value) {
      if (typeof value !== 'string' || value.length !== 13) {
        throw new Error('CustID_Nr must be a 13-character string');
      }
      this._CustID_Nr = value;
    }
  
    set AlertType(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('AlertType must be a non-empty string');
      }
      this._AlertType = value;
    }
  
    set SentDate(value) {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new Error('SentDate must be a valid date');
      }
      this._SentDate = value;
    }
  
    set LocationID(value) {
      if (typeof value !== 'number' || value <= 0) {
        throw new Error('LocationID must be a positive number');
      }
      this._LocationID = value;
    }
  
    set Receiver(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('Receiver must be a non-empty string');
      }
      this._Receiver = value;
    }
  
    set Message(value) {
      if (value && typeof value !== 'string') {
        throw new Error('Message must be a string');
      }
      this._Message = value || null; // Null if no message
    }
  
    //_____________________GETTERS_____________________________________
  
    get AlertID() {
      return this._AlertID;
    }
  
    get CustID_Nr() {
      return this._CustID_Nr;
    }
  
    get AlertType() {
      return this._AlertType;
    }
  
    get SentDate() {
      return this._SentDate;
    }
  
    get LocationID() {
      return this._LocationID;
    }
  
    get Receiver() {
      return this._Receiver;
    }
  
    get Message() {
      return this._Message;
    }
  }
  
  module.exports = Alert;
  