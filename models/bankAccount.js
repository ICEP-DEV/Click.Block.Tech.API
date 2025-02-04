class BankAccount {
  constructor(AccountID, AccountNr, ExpirationDate, AccountType, Balance,TransactionLimit ,CreationDate, isActive, LastModified, RestorationCount) {
    this._AccountID = AccountID;        // Unique identifier for the account
    this._AccountNr = AccountNr;        // Account number (9-digit random number)
    this._ExpirationDate = ExpirationDate;
    this._AccountType = AccountType;
    this._Balance = Balance;
    this._TransactionLimit = TransactionLimit;
    this._CreationDate = CreationDate;
    this._isActive = isActive;
    this._LastModified = LastModified;  
    this._RestorationCount = RestorationCount; 
  }

  //_____________________SETTERS_____________________________________

  set AccountID(value) {
    throw new Error('AccountID cannot be modified');
  }

  set AccountNr(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('AccountNr must be a valid string');
    }
    this._AccountNr = value;
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

  set TransactionLimit(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('TransactionLimit must be a non-negative number');
    }
    this._TransactionLimit = value;
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

  set LastModified(value) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('LastModified must be a valid date');
    }
    this._LastModified = value;
  }

  set RestorationCount(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('RestorationCount must be a non-negative number');
    }
    this._RestorationCount = value;
  }

  //_____________________GETTERS_____________________________________

  get AccountID() {
    return this._AccountID;
  }

  get AccountNr() {
    return this._AccountNr;
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
  
  get TransactionLimit() {
    return this._TransactionLimit;
  }

  get CreationDate() {
    return this._CreationDate;
  }

  get isActive() {
    return this._isActive;
  }

  get LastModified() {
    return this._LastModified;
  }

  get RestorationCount() {
    return this._RestorationCount;
  }
}

module.exports = BankAccount;
