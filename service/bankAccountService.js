const BankAccountDAO = require('../DAO/bankAccountDAO');
const {  sendAccountInfoEmail } = require('./sendAccountInfo_email');
const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};


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

    // Function to check uniqueness and insert the account
    const checkAndInsertAccount = () => {
      const generatedAccountNr = generateUniqueAccountNr();

      // Check if the generated AccountNr already exists in the database
      BankAccountDAO.getByAccountNr(generatedAccountNr, (err, result) => {
        if (err) return callback(err);

        if (result) {
          // If AccountNr exists, recursively generate a new one
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
          sendAccountInfoEmail(accountData)
                           .then(() =>  callback(null, result))
                           .catch(emailErr => callback({ status: 500, message: 'Failed to send account information' + emailErr.message }));
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
      if (!result) {
        return callback(new Error('Account not found'));
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
      if (!result) {
        return callback(new Error('Account update failed'));
      }
      callback(null, result); // Pass the result directly since it's already a boolean.
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
      if (!result) {
        return callback(new Error('Account deletion failed'));
      }
      callback(null, result); // Since `result` is already a boolean (true/false), pass it directly.
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

  getAccountActions: (callback) => {
    BankAccountDAO.getAccountActions((err, results) => {
      if (err) {
        return callback(new Error('Failed to retrieve account actions: ' + err.message));
      }
      if (!results || results.length === 0) {
        return callback(new Error('No account actions found'));
      }
      callback(null, results);
    });
  },
 
  //Get Customer Information
getAllCustomerDetails: (callback) => {
    BankAccountDAO.getAllCustomerDetails((err, results) => {
        if (err) {
            return callback(new Error('Failed to retrieve customer details: ' + err.message));
        }

        // Format the date in each result
        const formattedResults = results.map((item) => ({
            ...item,
            "Registration Date": formatDate(item["Registration Date"]),
        }));

        callback(null, formattedResults);
    });
},

// To Filter Accounts Based on their Account Status
getFilteredAccounts: (status, callback) => {
  BankAccountDAO.getAllCustomerDetails((err, results) => {
      if (err) {
          return callback(new Error('Failed to retrieve customer details: ' + err.message));
      }

      // Filter results based on the status
      const filteredResults = results.filter(item => item["Account Status"].toLowerCase() === status.toLowerCase());

      callback(null, filteredResults);
  });
},


freezeAccount : (accountID, callback) => {
  if (!accountID) {
    return callback(new Error('Account ID is required'));
  }
 
  BankAccountDAO.freezeAccount(accountID, (err, result) => {
    if (err) {
      return callback(new Error('Failed to freeze account: ' + err.message));
    }
    if (!result) {
      return callback(new Error('Account freeze operation failed'));
    }
    callback(null, result);
  });
},
deactivateAccount: (accountID, callback) => {
  if (!accountID) {
    return callback(new Error('Account ID is required'));
  }
 
  BankAccountDAO.updateToDeactivedAccount(accountID, { isActive: 0 }, (err, result) => {
    if (err) {
      return callback(new Error('Failed to deactivate account: ' + err.message));
    }
    if (!result) {
      return callback(new Error('Account not found or already deactivated'));
    }
    callback(null, result); // Pass true if deactivation was successful
  });
},

// Method to set transaction limit for an account
setTransactionLimit: (accountID, TransactionLimit, callback) => {
  if (!accountID || limit < 0) {
    return callback(new Error('Valid account ID and non-negative limit are required'));
  }

  const sql = 'UPDATE bankaccount SET TransactionLimit = ? WHERE AccountID = ?';
  db.query(sql, [limit, accountID], (err, result) => {
    if (err) {
      console.error(err);
      return callback(new Error('Failed to set transaction limit: ' + err.message));
    }
    // Ensure that at least one row was updated
    if (result.affectedRows > 0) {
      return callback(null, { accountID, transactionLimit: TransactionLimit });
    }
    return callback(new Error('Account not found or no changes made'));
  });
},

// Method to set transaction limit for an account
updateTransactionLimitByCustomerID: (custid_nr, transactionLimit, callback) => {
  if (!custid_nr || transactionLimit < 0) {
    return callback(new Error('Valid customer ID and non-negative limit are required'));
  }

  // Step 1: Get AccountID from Customer table
  BankAccountDAO.getAccountIDByCustomerID(custid_nr, (err, accountID) => {
    if (err) {
      return callback(err);
    }

    console.log('Retrieved AccountID:', accountID);

    // Step 2: Update Transaction Limit for the retrieved AccountID
    BankAccountDAO.updateTransactionLimit(accountID, transactionLimit, (err, success) => {
      if (err) {
        return callback(err);
      }
      callback(null, success);
    });
  });
},

// Method to get transaction limit for an account
fetchTransactionLimit: (accountID, callback) => {
  BankAccountDAO.getTransactionLimit(accountID, (err, limit) => {
    if (err) {
      return callback(err);
    }
    callback(null, limit);
  });
},

 
};

module.exports = BankAccountService;
