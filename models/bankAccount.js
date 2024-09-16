class BankAccount {
  constructor(AccountID, CustID_Nr, ExpirationDate, AccountType, Balance, CreationDate, isActive) {
    this._AccountID = AccountID;
    this._CustID_Nr = CustID_Nr;
    this._ExpirationDate = ExpirationDate;
    this._AccountType = AccountType;
    this._Balance = Balance;
    this._CreationDate = CreationDate;
    this._isActive = isActive;
  }

  //_____________________SETTERS_____________________________________

  set AccountID(value) {
    throw new Error('AccountID cannot be modified');
  }

  set CustID_Nr(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('CustID_Nr must be a valid string');
    }
    this._CustID_Nr = value;
  }

  set ExpirationDate(value) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('ExpirationDate must be a valid date');
    }
    this._ExpirationDate = value;
  }

  set AccountType(value) {
    const allowedTypes = ['Savings', 'Loan', 'Checking']; // Example account types
    if (!allowedTypes.includes(value)) {
      throw new Error('Invalid account type');
    }
    this._AccountType = value;
  }

  set Balance(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('Balance must be a non-negative number');
    }
    this._Balance = value;
  }

  set CreationDate(value) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('CreationDate must be a valid date');
    }
    this._CreationDate = value;
  }

  set isActive(value) {
    if (typeof value !== 'boolean') {
      throw new Error('isActive must be a boolean');
    }
    this._isActive = value;
  }

  //_____________________GETTERS_____________________________________

  get AccountID() {
    return this._AccountID;
  }

  get CustID_Nr() {
    return this._CustID_Nr;
  }

  get ExpirationDate() {
    return this._ExpirationDate;
  }

  get AccountType() {
    return this._AccountType;
  }

  get Balance() {
    return this._Balance;
  }

  get CreationDate() {
    return this._CreationDate;
  }

  get isActive() {
    return this._isActive;
  }
}

module.exports = BankAccount;
