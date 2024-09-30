class Customer {
  constructor(CustID_Nr, FirstName, LastName, PhoneNumber, Address, Email, DateOfBirth, LoginPin, AlertPin, isVerified, PanicButtonStatus, AccountID) {
    this._CustID_Nr = CustID_Nr;
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
    this._AccountID = AccountID; // Replaced AdminID with AccountID
  }

  // Getters and Setters (error handling remains the same)
  set CustID_Nr(value) { throw new Error('CustID_Nr cannot be modified'); }
  
  // Other setters and getters (kept same)...
  
  get CustID_Nr() { return this._CustID_Nr; }
  get FirstName() { return this._FirstName; }
  get LastName() { return this._LastName; }
  get PhoneNumber() { return this._PhoneNumber; }
  get Address() { return this._Address; }
  get Email() { return this._Email; }
  get DateOfBirth() { return this._DateOfBirth; }
  get LoginPin() { return this._LoginPin; }
  get AlertPin() { return this._AlertPin; }
  get isVerified() { return this._isVerified; }
  get PanicButtonStatus() { return this._PanicButtonStatus; }
  get AccountID() { return this._AccountID; } // Getter for AccountID
}

module.exports = Customer;
