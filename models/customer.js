class Customer {

  constructor(CustID_Nr, FirstName, LastName, PhoneNumber, Address, Email, DateOfBirth, LoginPin, AlertPin, isActive, PanicButtonStatus, AccountID) {
    this._CustID_Nr = CustID_Nr; // this is the id number and serves as the PK

    this._FirstName = FirstName;
    this._LastName = LastName;
    this._PhoneNumber = PhoneNumber;
    this._Address = Address;
    this._Email = Email;
    this._DateOfBirth = DateOfBirth;
    this._LoginPin = LoginPin;
    this._AlertPin = AlertPin;
    this._isVerified = isVerified;
    this._PanicButtonStatus = PanicButtonStatus;

    this._AccountID = AccountID;
  }

//_____________________SETTERS_____________________________________

  set CustID_Nr(value) {
    // CustID_Nr should not be modified since it serves as the PK
    throw new Error('CustID_Nr cannot be modified');
  }

  set FirstName(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('FirstName must be a non-empty string');
    }
    this._FirstName = value;
  }

  set LastName(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('LastName must be a non-empty string');
    }
    this._LastName = value;
  }

  set PhoneNumber(value) {
    const phoneRegex = /^[0-9]{10}$/; 
    if (!phoneRegex.test(value)) {
      throw new Error('PhoneNumber must be a 10-digit number');
    }
    this._PhoneNumber = value;
  }

  set Address(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Address must be a non-empty string');
    }
    this._Address = value;
  }

  set Email(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      throw new Error('Invalid email format');
    }
    this._Email = value;
  }

  set DateOfBirth(value) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('DateOfBirth must be a valid date');
    }
    this._DateOfBirth = value;
  }

  set LoginPin(value) {
    if (typeof value !== 'string' || value.length < 4) {
      throw new Error('LoginPin must be a string with at least 4 characters');
    }
    this._LoginPin = value;
  }

  //What length is the AlertPin?
  set AlertPin(value) {
    if (typeof value !== 'string' || value.length < 4) {
      throw new Error('AlertPin must be a string with at least 4 characters');
    }
    this._AlertPin = value;
  }

  set isActive(value) {
    if (typeof value !== 'boolean') {
      throw new Error('isActive must be a boolean');
    }
    this._isActive = value;
  }

  set PanicButtonStatus(value) {
    if (typeof value !== 'boolean') {
      throw new Error('PanicButtonStatus must be a boolean');
    }
    this._PanicButtonStatus = value;
  }

  set AccountID(value){
    if(typeof value !== 'string' || value.length < 10 || value.length > 10){
      throw new Error('Account must be a 10 digits');
    }
    this._AccountID = value
  }

 

  //_______________________________GETTERS_________________________________

  get CustID_Nr() {
    return this._CustID_Nr;
  }

  get FirstName() {
    return this._FirstName;
  }

  get LastName() {
    return this._LastName;
  }

  get PhoneNumber() {
    return this._PhoneNumber;
  }

  get Address() {
    return this._Address;
  }

  get Email() {
    return this._Email;
  }

  get DateOfBirth() {
    return this._DateOfBirth;
  }

  get LoginPin() {
    return this._LoginPin;
  }

  get AlertPin() {
    return this._AlertPin;
  }

  get isActive() {
    return this._isActive;
  }

  get PanicButtonStatus() {
    return this._PanicButtonStatus;
  }

  get AccountID(){
    return this._AccountID;
  }

}

module.exports = Customer;
