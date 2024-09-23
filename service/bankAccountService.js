const BankAccountDAO = require('../DAO/bankAccountDAO');

const BankAccountService = {
  createAccount: (accountData, callback) => {
    // Ensure AccountType is provided
    if (!accountData.AccountType) {
      return callback(new Error('Account Type is required'));
    }

    // Function to generate a random 9-digit AccountNr
    const generateUniqueAccountNr = () => {
      return Math.floor(100000000 + Math.random() * 900000000).toString();
    };

    // Recursive function to check for uniqueness of AccountNr and insert the account
    const checkAndInsertAccount = () => {
      const generatedAccountNr = generateUniqueAccountNr();

      // Check if the generated AccountNr already exists in the database
      BankAccountDAO.getByAccountNr(generatedAccountNr, (err, result) => {
        if (err) return callback(err);

        if (result) {
          // If the AccountNr exists, recursively generate a new one
          checkAndInsertAccount();
        } else {
          // If AccountNr is unique, proceed with the account creation
          accountData.AccountNr = generatedAccountNr;
          const currentDate = new Date();
          accountData.CreationDate = currentDate;
          accountData.ExpirationDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 3));
          accountData.Balance = 0.0;
          accountData.isActive = true;

          // Call DAO to save the new account
          BankAccountDAO.create(accountData, (err, result) => {
            if (err) {
              return callback(new Error('Failed to create account: ' + err.message));
            }
            callback(null, result);
          });
        }
      });
    };

    // Start the uniqueness check and account creation process
    checkAndInsertAccount();
  },

  getAccountById: (accountID, callback) => {
    if (!accountID) return callback(new Error('Account ID is required'));

    BankAccountDAO.getById(accountID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve account: ' + err.message));
      }
      callback(null, result);
    });
  },

  updateAccount: (accountID, updateData, callback) => {
    if (!accountID || !updateData) return callback(new Error('Account ID and update data are required'));

    BankAccountDAO.update(accountID, updateData, (err, result) => {
      if (err) {
        return callback(new Error('Failed to update account: ' + err.message));
      }
      callback(null, result);
    });
  },

  deleteAccount: (accountID, callback) => {
    if (!accountID) return callback(new Error('Account ID is required'));

    BankAccountDAO.delete(accountID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to delete account: ' + err.message));
      }
      callback(null, result);
    });
  }
};


module.exports = BankAccountService;
