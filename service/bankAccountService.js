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
          accountData.ExpirationDate = new Date(currentDate.getFullYear() + 3, currentDate.getMonth(), currentDate.getDate());

          // Set balance to provided amount or default to 0
          accountData.Balance = accountData.Balance >= 0 ? accountData.Balance : 0; 
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
    if (!accountID) {
      return callback(new Error('Account ID is required'));
    }

    BankAccountDAO.getById(accountID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve account: ' + err.message));
      }
      callback(null, result);
    });
  },

  updateAccount: (accountID, updateData, callback) => {
    if (!accountID || !updateData) {
      return callback(new Error('Account ID and update data are required'));
    }

    BankAccountDAO.update(accountID, updateData, (err, result) => {
      if (err) {
        return callback(new Error('Failed to update account: ' + err.message));
      }
      callback(null, result.affectedRows > 0); // Returns true if update was successful
    });
  },

  deleteAccount: (accountID, callback) => {
    if (!accountID) {
      return callback(new Error('Account ID is required'));
    }

    BankAccountDAO.delete(accountID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to delete account: ' + err.message));
      }
      callback(null, result.affectedRows > 0); // Returns true if deletion was successful
    });
  },

  deposit: (accountID, amount, callback) => {
    if (!accountID || amount <= 0) {
      return callback(new Error('Valid account ID and amount are required'));
    }

    BankAccountDAO.getById(accountID, (err, account) => {
      if (err) return callback(err);
      if (!account) return callback(new Error('Account not found'));

      const newBalance = account.Balance + amount;

      BankAccountDAO.update(accountID, { Balance: newBalance }, (err, result) => {
        if (err) return callback(new Error('Failed to update balance: ' + err.message));
        callback(null, { accountID, newBalance });
      });
    });
  },

  withdraw: (accountID, amount, callback) => {
    if (!accountID || amount <= 0) {
      return callback(new Error('Valid account ID and amount are required'));
    }

    BankAccountDAO.getById(accountID, (err, account) => {
      if (err) return callback(err);
      if (!account) return callback(new Error('Account not found'));
      if (account.Balance < amount) return callback(new Error('Insufficient funds'));

      const newBalance = account.Balance - amount;

      BankAccountDAO.update(accountID, { Balance: newBalance }, (err, result) => {
        if (err) return callback(new Error('Failed to update balance: ' + err.message));
        callback(null, { accountID, newBalance });
      });
    });
  },
};

module.exports = BankAccountService;
