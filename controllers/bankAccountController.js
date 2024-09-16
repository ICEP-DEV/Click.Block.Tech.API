const BankAccountService = require('../service/bankAccountService');

const createAccount = (req, res) => {
  const accountData = req.body;
  BankAccountService.createAccount(accountData, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(result);
  });
};

const getAccount = (req, res) => {
  const accountID = req.params.accountID;
  BankAccountService.getAccountById(accountID, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send('Account not found');
    }
  });
};

const updateAccount = (req, res) => {
  const accountID = req.params.accountID;
  const updateData = req.body;
  BankAccountService.updateAccount(accountID, updateData, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
};

const deleteAccount = (req, res) => {
  const accountID = req.params.accountID;
  BankAccountService.deleteAccount(accountID, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
};

module.exports = { createAccount, getAccount, updateAccount, deleteAccount };
