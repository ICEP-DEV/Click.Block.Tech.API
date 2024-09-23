const BankAccountService = require('../service/bankAccountService');

const createAccount = (req, res) => {
  const accountData = req.body;

  console.log('Creating account with data:', accountData);  

  BankAccountService.createAccount(accountData, (err, result) => {
    if (err) {
      console.error('Error in createAccount:', err);  // error details
      return res.status(500).json({ error: 'Failed to create account', message: err.message });
    }
    res.status(201).json(result);
  });
};

const getAccount = (req, res) => {
  const accountID = req.params.accountID;

  console.log('Fetching account with ID:', accountID);  // Log the account ID

  BankAccountService.getAccountById(accountID, (err, result) => {
    if (err) {
      console.error('Error in getAccount:', err);  // Log error details
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

  console.log('Updating account with ID:', accountID, 'with data:', updateData);  // Log update details

  BankAccountService.updateAccount(accountID, updateData, (err, result) => {
    if (err) {
      console.error('Error in updateAccount:', err);  // Log error details
      return res.status(500).json({ error: 'Failed to update account', message: err.message });
    }
    res.status(200).json(result);
  });
};

const deleteAccount = (req, res) => {
  const accountID = req.params.accountID;

  console.log('Deleting account with ID:', accountID);  // Log account ID

  BankAccountService.deleteAccount(accountID, (err, result) => {
    if (err) {
      console.error('Error in deleteAccount:', err);  // Log error details
      return res.status(500).json({ error: 'Failed to delete account', message: err.message });
    }
    res.status(200).json(result);
  });
};

module.exports = { createAccount, getAccount, updateAccount, deleteAccount };
