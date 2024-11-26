class Notification {
    constructor(id, transactionId, notificationType, sentDate, status) {
        this._id = id;
        this._transactionId = transactionId;
        this._notificationType = notificationType;
        this._sentDate = sentDate;
        this._status = status;
    }
    
//_____________________SETTERS_____________________________________

  set id(value) {
    // CustID_Nr should not be modified since it serves as the PK
    throw new Error('CustID_Nr cannot be modified');
  }
  

  set transactionId(value) {
    if (typeof value !== 'number' || value.trim() === '') {
      throw new Error('transactionID must be a non-empty string');
    }
    this._transactionId = value;
  }

  set notificationType(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('notification Type must be a non-empty string');
    }
    this._notificationType = value;
  }

  set sentDate(value) {
   
    if (value === null || value === undefined) {
      throw new Error('send date is empty');
    }
    this._sentDate = value;
  }
  set status(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('status Type must be a non-empty string');
    }
    this._status = value;
  }
  //_______________________________GETTERS_________________________________

  get id() {
    return this._id;
  }

  get transactionId() {
    return this._transactionId;
  }

  get notificationType() {
    return this._notificationType;
  }

  get sentDate() {
    return this._sentDate;
  }

  get status() {
    return this._status;
  }

}


module.exports = Notification;