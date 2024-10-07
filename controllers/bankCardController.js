const BankCardService = require('../service/bankCardService');

const createBankCard = (req, res) => {
  const bankCardData = req.body;

  console.log('Creating bank card with data:', bankCardData);

  BankCardService.createBankCard(bankCardData, (err, cardID) => {
    if (err) {
      console.error('Error in createBankCard:', err);
      return res.status(500).json({ error: 'Failed to create bank card', message: err.message });
    }
    res.status(201).json({ CardID: cardID });
  });
};

const getBankCard = (req, res) => {
  const CardID = req.params.cardID;

  console.log('Fetching bank card with ID:', CardID);

  BankCardService.getCardById(CardID, (err, result) => {
    if (err) {
      console.error('Error in getBankCard:', err);
      return res.status(500).json({ error: 'Failed to retrieve bank card', message: err.message });
    }
    if (!result) {
      return res.status(404).json({ error: 'Bank card not found' });
    }
    res.status(200).json(result);
  });
};

const updateBankCard = (req, res) => {
  const CardID = req.params.cardID;
  const updateData = req.body;

  console.log('Updating bank card with ID:', CardID, 'with data:', updateData);

  BankCardService.updateCard(CardID, updateData, (err, result) => {
    if (err) {
      console.error('Error in updateBankCard:', err);
      return res.status(500).json({ error: 'Failed to update bank card', message: err.message });
    }
    res.status(200).json({ message: 'Bank card updated successfully', success: result });
  });
};

const deleteBankCard = (req, res) => {
  const CardID = req.params.cardID;

  console.log('Deleting bank card with ID:', CardID);

  BankCardService.deleteCard(CardID, (err, result) => {
    if (err) {
      console.error('Error in deleteBankCard:', err);
      return res.status(500).json({ error: 'Failed to delete bank card', message: err.message });
    }
    if (!result) {
      return res.status(404).json({ error: 'Bank card not found' });
    }
    res.status(204).json({ message: 'Bank card deleted successfully' });
  });
};

const getCardsByAccountID = (req, res) => {
  const AccountID = req.params.accountID;

  console.log('Fetching bank cards for Account ID:', AccountID);

  BankCardService.getCardsByAccountID(AccountID, (err, result) => {
    if (err) {
      console.error('Error in getCardsByAccountID:', err);
      return res.status(500).json({ error: 'Failed to retrieve bank cards', message: err.message });
    }
    res.status(200).json(result);
  });

};

const getCustomerByCardID = (req, res) => {
  const CardID = req.params.cardID;

  console.log('Fetching customer for bank card with ID:', CardID);

  BankCardService.getCustomerByCardID(CardID, (err, result) => {
    if (err) {
      console.error('Error in getCustomerByCardID:', err);
      return res.status(500).json({ error: 'Failed to retrieve customer', message: err.message });
    }
    if (!result) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(result);
  });
};


module.exports = {
  createBankCard,
  getBankCard,
  updateBankCard,
  deleteBankCard,
  getCardsByAccountID,
  getCustomerByCardID
};
