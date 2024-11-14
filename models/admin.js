class Admin {
    constructor(LastName, FirstName, PhoneNumber, Address, Email, DateOfBirth, LoginPin, AdminID = Admin.generateAdminID()) {
        this._AdminID = AdminID; // Primary Key, immutable
        this._LastName = LastName;
        this._FirstName = FirstName;
        this._PhoneNumber = PhoneNumber;
        this._Address = Address;
        this._Email = Email;
        this._DateOfBirth = DateOfBirth;
        this._LoginPin = LoginPin; // Store hashed password
    }

    // Static method to generate a 10-digit AdminID
    static generateAdminID() {
        return Math.floor(1000000000 + Math.random() * 9000000000); // Generates a 10-digit number
    }

    // Setters and Getters with validation
    set AdminID(value) {
        throw new Error('AdminID cannot be modified');
    }

    set LastName(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error('LastName must be a non-empty string');
        }
        this._LastName = value;
    }

    set FirstName(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error('FirstName must be a non-empty string');
        }
        this._FirstName = value;
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

    // Getters
    get AdminID() { return this._AdminID; }
    get LastName() { return this._LastName; }
    get FirstName() { return this._FirstName; }
    get PhoneNumber() { return this._PhoneNumber; }
    get Address() { return this._Address; }
    get Email() { return this._Email; }
    get DateOfBirth() { return this._DateOfBirth; }
    get LoginPin() { return this._LoginPin; }
}

module.exports = Admin;
