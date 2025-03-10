const BankAccountService = require('../service/bankAccountService');

const createAccount = (req, res) => {
  const accountData = req.body;

  console.log('Creating account with data:', accountData);

  BankAccountService.createAccount(accountData, (err, result) => {
    if (err) {
      console.error('Error in createAccount:', err);
      return res.status(500).json({ error: 'Failed to create account', message: err.message });
    }
    res.status(201).json(result);
  });
};

const getAccount = (req, res) => {
  const accountID = req.params.accountID;

  console.log('Fetching account with ID:', accountID);

  BankAccountService.getAccountById(accountID, (err, result) => {
    if (err) {
      console.error('Error in getAccount:', err);
      return res.status(500).json({ error: 'Failed to fetch account', message: err.message });
    }
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  });
};

const updateAccount = (req, res) => {
  const accountID = req.params.accountID;
  const updateData = req.body;

  console.log('Updating account with ID:', accountID, 'with data:', updateData);

  BankAccountService.updateAccount(accountID, updateData, (err, result) => {
    if (err) {
      console.error('Error in updateAccount:', err);
      return res.status(500).json({ error: 'Failed to update account', message: err.message });
    }
    res.status(200).json(result);
  });
};

const deleteAccount = (req, res) => {
  const accountID = req.params.accountID;

  console.log('Deleting account with ID:', accountID);

  BankAccountService.deleteAccount(accountID, (err, result) => {
    if (err) {
      console.error('Error in deleteAccount:', err);
      return res.status(500).json({ error: 'Failed to delete account', message: err.message });
    }
    res.status(200).json({ message: 'Account deleted successfully', result });
  });
};







// const getAccountActions = (req, res) => {
//   const accountID = req.params.accountID;

//   console.log('Fetching account with ID:', accountID);

//   BankAccountService.getAccountActions(accountID, (err, result) => {
//     if (err) {
//       console.error('Error in getAccountActions:', err);
//       return res.status(500).json({ error: 'Failed to fetch account', message: err.message });
//     }
//     if (result) {
//       res.status(200).json(result);
//     } else {
//       res.status(404).json({ error: 'Account not found' });
//     }
//   });
// };
const getAccountActions = (req, res) => {
  BankAccountService.getAccountActions((err, results) => {
    if (err) {
      console.error('Error in getAccountActions:', err);
      return res.status(500).json({ error: 'Failed to fetch account actions', message: err.message });
    }
    res.status(200).json(results);
  });
};

const getAllCustomerDetails = (req, res) => {
  BankAccountService.getAllCustomerDetails((err, results) => {
      if (err) {
          console.error('Error fetching customer details:', err);
          return res.status(500).json({ error: 'Failed to fetch customer details', message: err.message });
      }
      res.status(200).json(results);
  });
};

const getFilteredAccounts = (req, res) => {
  const status = req.query.status; // Extract the `status` query parameter from the request

  if (!status) {
      return res.status(400).json({ error: 'Account status is required' });
  }

  BankAccountService.getFilteredAccounts(status, (err, results) => {
      if (err) {
          console.error('Error in getFilteredAccounts:', err);
          return res.status(500).json({ error: 'Failed to fetch filtered accounts', message: err.message });
      }

      res.status(200).json(results);
  });
};

  //Freeze Bank Account 

  const freezeAccount = (req, res) => {
    const accountID = req.params.accountID;
   
    console.log('Freezing account with ID:', accountID);
   
    BankAccountService.freezeAccount(accountID, (err, result) => {
      if (err) {
        console.error('Error in freezeAccount:', err);
        return res.status(500).json({ error: 'Failed to freeze account', message: err.message });
      }
      res.status(200).json({ message: 'Account frozen successfully', result });
    });
  };


  //Deactivate Bank Account
  const deactivateAccount = (req, res) => {
    const accountID = req.params.accountID;
   
    console.log('Deactivating account with ID:', accountID);
   
    BankAccountService.deactivateAccount(accountID, (err, result) => {
      if (err) {
        console.error('Error in deactivateAccount:', err);
        return res.status(500).json({ error: 'Failed to deactivate account', message: err.message });
      }
      if (result) {
        res.status(200).json({ message: 'Account deactivated successfully', result });
      } else {
        res.status(404).json({ error: 'Account not found or already deactivated' });
      }
    });
  };
  
  const setTransactionLimit = (req, res) => {
    const { transactionLimit } = req.body;
    const { custid_nr } = req.params;

    if (!custid_nr || typeof transactionLimit !== 'number' || transactionLimit < 0) {
        return res.status(400).json({ error: 'Invalid input. Customer ID and a non-negative TransactionLimit are required' });
    }

    console.log('Received Request:', { custid_nr, transactionLimit });

    // Call service to handle logic
    BankAccountService.updateTransactionLimitByCustomerID(custid_nr, transactionLimit, (err, success) => {
        if (err) {
            console.error('Error:', err.message);
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: 'Transaction limit updated successfully' });
    });
};

  
  const getTransactionLimit = (req, res) => {
    const { accountID } = req.params;
  
    if (!accountID) {
      return res.status(400).json({ error: 'AccountID is required' });
    }
  
    BankAccountService.fetchTransactionLimit(accountID, (err, limit) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ transactionLimit: limit });
    });
  };


module.exports = { createAccount, getAccount, updateAccount, deleteAccount, getAccountActions,getAllCustomerDetails,getFilteredAccounts,freezeAccount ,deactivateAccount,setTransactionLimit, getTransactionLimit};
