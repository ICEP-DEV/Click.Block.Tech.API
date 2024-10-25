const BankCardDAO = require('../DAO/bankCardDAO');

const BankCardService = {
  createBankCard: (newBankCard, callback) => {
    if (!newBankCard.AccountID) {
      return callback(new Error('Account ID is required'));
    }

    // Randomize last 12 digits of card number (first 4 digits are 5478)
    const randomCardNumber = '5478' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');

    // Randomize CVV (3-digit number)
    const randomCVV = Math.floor(100 + Math.random() * 900).toString();

    // Randomize expiration date (1-5 years in the future)
    const currentDate = new Date();
    const futureYear = currentDate.getFullYear() + Math.floor(Math.random() * 5) + 1;
    const randomExpirationDate = new Date(futureYear, currentDate.getMonth(), currentDate.getDate());

    // Setting defaults for missing fields
    newBankCard.CardNumber = randomCardNumber;
    newBankCard.CVV = randomCVV;
    newBankCard.ExpirationDate = randomExpirationDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    newBankCard.IsActive = 1; // Active by default

    BankCardDAO.create(newBankCard, (err, cardID) => {
      if (err) {
        return callback(new Error('Failed to create bank card: ' + err.message));
      }
      callback(null, cardID); // Return the new CardID
    });
  },

  getCardById: (CardID, callback) => {
    if (!CardID) {
      return callback(new Error('Card ID is required'));
    }

    BankCardDAO.getById(CardID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve card: ' + err.message));
      }
      callback(null, result);
    });
  },

  updateCard: (CardID, updateData, callback) => {
    if (!CardID || !updateData) {
      return callback(new Error('Card ID and update data are required'));
    }

    BankCardDAO.update(CardID, updateData, (err, result) => {
      if (err) {
        return callback(new Error('Failed to update card: ' + err.message));
      }
      callback(null, result); // Pass the result directly since it's already a boolean.
    });
  },

  deleteCard: (CardID, callback) => {
    if (!CardID) {
      return callback(new Error('Card ID is required'));
    }

    BankCardDAO.delete(CardID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to delete card: ' + err.message));
      }
      callback(null, result); // Since `result` is already a boolean (true/false), pass it directly.
    });
  },

  getCardsByAccountID: (AccountID, callback) => {
    if (!AccountID) {
      return callback(new Error('Account ID is required'));
    }
    BankCardDAO.getCustCardDetailsByAccountID(AccountID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve cards: ' + err.message));
      }
      callback(null, result);
    });
  },

  // get customer information associated to the bank card
  getCustomerByAccID: (AccountID, callback) => {
    if (!AccountID) {
      return callback(new Error('Card ID is required'));
    }

    BankCardDAO.getCustCardDetailsByAccountID(AccountID, (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve customer: ' + err.message));
      }
      if (!result) {
        return callback(new Error('Customer not found'));
      }
      callback(null, result);
    });
  }
};

module.exports = BankCardService;
