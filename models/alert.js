class Alert{
    constructor(AlertID, CustID_Nr, AlertType, SentDate, LocationID, Receiver, Message){
    this._AlertID = AlertID;
    this._CustID_Nr = CustID_Nr;
    this._Alerttype = AlertType;
    this._SentDate = SentDate;
    this._LocationID = LocationID;
    this._Receiver = Receiver;
    this._Message = Message;
}

set AlertID(value){
    throw new Error('AlertID Cannot be modified');
}

set CustID_Nr(value){
        throw new Error('CustID_Nr cannot be modified')
}

set AlertType(value){
    if(typeof value !== 'string' || value.trim() === ''){
        throw new Error('AlertType must be a non empty string');
    }
}
set SentDate(value){
    if(typeof value !== 'string' || value.trim() === ''){
        throw new Error('SentDate must be a non empty string');
    }
}
set LocationID(value){
    if(typeof value !== 'string' || value.trim() === ''){
        throw new Error('LocationId must be a non empty string');
    }
}
set Receiver(value){
    if(typeof value !== 'string' || value.trim() === ''){
        throw new Error('Receiver must be a non empty string');
    }
}
set Message(value){
    if(typeof value !== 'string' || value.trim() === ''){
        throw new Error('Receiver must be a non empty string');
    }
}
get CustID_Nr() { return this._CustID_Nr; }
get AlertID() { return this._AlertID; }
get AlertType() { return this._Alerttype; }
get SentDate() { return this._SentDate; }
get LocationID() { return this._LocationID; }
get Receiver() { return this._Receiver; }
get Message() { return this._Message; }

}
module.exports = Alert;