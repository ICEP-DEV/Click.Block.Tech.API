const BankAccountDAO = require('../DAO/bankAccountDAO');

const BankAccountService = {
  createAccount: (accountData, callback) => {
    if (!accountData.CustID_Nr || !accountData.AccountType) {
      return callback(new Error('Customer ID and Account Type are required'));
    }

    // Generate a random 11-digit AccountID
    const generatedAccountID = Math.floor(10000000000 + Math.random() * 90000000000);

    // Attach the generated AccountID
    accountData.AccountID = generatedAccountID;

    // Set Creation Date and Expiration Date
    const currentDate = new Date();
    accountData.CreationDate = currentDate;
    accountData.ExpirationDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 3));
    
    // Initially set balance and isActive
    accountData.Balance = 0.0;
    accountData.isActive = true;

    // Call DAO to save the new account
    BankAccountDAO.create(accountData, callback);
  },

  getAccountById: (accountID, callback) => {
    if (!accountID) return callback(new Error('Account ID is required'));

    BankAccountDAO.getById(accountID, callback);
  },

  updateAccount: (accountID, updateData, callback) => {
    if (!accountID || !updateData) return callback(new Error('Account ID and update data are required'));

    BankAccountDAO.update(accountID, updateData, callback);
  },

  deleteAccount: (accountID, callback) => {
    if (!accountID) return callback(new Error('Account ID is required'));

    BankAccountDAO.delete(accountID, callback);
  }
};

module.exports = BankAccountService;
