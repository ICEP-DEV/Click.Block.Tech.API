class ContactMeMessage {
  constructor(MessageID, CustID_Nr, FullNames, PhoneNumber, Email, MessageDescription, Status, AdminID, SentTime) {
    this._MessageID = MessageID;
    this._CustID_Nr = CustID_Nr;
    this._FullNames = FullNames;
    this._PhoneNumber = PhoneNumber;
    this._Email = Email;
    this._MessageDescription = MessageDescription;
    this._Status = Status;
    this._AdminID = AdminID;
    this._SentTime = SentTime; // New property
  }

  // Getters
  get MessageID() { return this._MessageID; }
  get CustID_Nr() { return this._CustID_Nr; }
  get FullNames() { return this._FullNames; }
  get PhoneNumber() { return this._PhoneNumber; }
  get Email() { return this._Email; }
  get MessageDescription() { return this._MessageDescription; }
  get Status() { return this._Status; }
  get AdminID() { return this._AdminID; }
  get SentTime() { return this._SentTime; } 

  // Setters (add validation as needed)
  set Status(value) {
    if (!['Pending', 'Resolved', 'Closed'].includes(value)) throw new Error('Invalid status');
    this._Status = value;
  }
}

module.exports = ContactMeMessage;
