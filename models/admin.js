class Admin {
    constructor(AdminID, Firstname, Email, Role) {
        this._AdminID = AdminID;
        this._Firstname = Firstname;
        this._Email = Email;
        this._Role = Role;
    }
 // ===============================================================================================
 //                                             Setters
  // ===============================================================================================

    set AdminID(id) {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error('AdminID must be a positive number.');
        }
        this._AdminID = id;
    }

    set Firstname(name) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Firstname must be a non-empty string.');
        }
        this._Firstname = name;
    }

    set Email(email) {
        const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailPattern.test(email)) {
            throw new Error('Invalid email format.');
        }
        this._Email = email;
    }

    set Role(role) {
        const validRoles = ['admin', 'superadmin'];
        if (!validRoles.includes(role.toLowerCase())) {
            throw new Error('Invalid role. Role must be one of the following: admin, superadmin.');
        }
        this._Role = role;
    }

    // ===============================================================================================
    //                                          Getters
    // ===============================================================================================

    get AdminID() {
        return this._AdminID;
    }

    get Firstname() {
        return this._Firstname;
    }

    get Email() {
        return this._Email;
    }

    get Role() {
        return this._Role;
    }

    // Method to display Admin details (excluding sensitive info like password)
    displayAdminDetails() {
        return {
            AdminID: this._AdminID,
            Firstname: this._Firstname,
            Email: this._Email,
            Role: this._Role
        };
    }
}

module.exports = Admin;
