const db = require('../config/config');
const BankCard = require('../models/bankCard');

const BankCardDAO = {
  create: (newBankCard, callback) => {
    const sql = `
      INSERT INTO bankcard (AccountID, CardNumber, CardType, ExpirationDate, CVV, IsActive) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [newBankCard.AccountID, newBankCard.CardNumber, newBankCard.CardType, 
                   newBankCard.ExpirationDate, newBankCard.CVV, newBankCard.IsActive], 
    (err, result) => {
      if (err) {
        return callback(new Error('Failed to create bank card: ' + err.message));
      }
      callback(null, result.insertId); // Return the new CardID
    });
  },

  getById: (CardID, callback) => {
    const sql = 'SELECT * FROM bankcard WHERE CardID = ?';
    db.query(sql, [CardID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to retrieve card: ' + err.message));
      }
      if (result.length > 0) {
        const bankCard = new BankCard(
          result[0].CardID,
          result[0].AccountID,
          result[0].CardNumber,
          result[0].CardType,
          result[0].ExpirationDate,
          result[0].CVV,
          result[0].IsActive
        );
        return callback(null, bankCard);
      }
      callback(null, null); // Card not found
    });
  },

  update: (CardID, updateData, callback) => {
    const sql = 'UPDATE bankcard SET ? WHERE CardID = ?';
    db.query(sql, [updateData, CardID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to update card: ' + err.message));
      }
      callback(null, result.affectedRows > 0); // Returns true if update was successful
    });
  },

  delete: (CardID, callback) => {
    const sql = 'DELETE FROM bankcard WHERE CardID = ?';
    db.query(sql, [CardID], (err, result) => {
      if (err) {
        return callback(new Error('Failed to delete card: ' + err.message));
      }
      callback(null, result.affectedRows > 0); // Returns true if deletion was successful
    });
  },

  getByAccountID: (AccountID, callback) => {
    const sql = `
      SELECT 
        bc.CardID,
        bc.AccountID,
        bc.CardNumber,
        bc.CardType,
        bc.ExpirationDate,
        bc.CVV,
        bc.IsActive,
        c.FirstName,
        c.LastName
      FROM bankcard bc
      JOIN customer c ON bc.AccountID = c.AccountID
      WHERE bc.AccountID = ?`;

    db.query(sql, [AccountID], (err, results) => {
      if (err) {
        return callback(new Error('Failed to retrieve cards: ' + err.message));
      }

      const bankCards = results.map(result => ({
        CardID: result.CardID,
        AccountID: result.AccountID,
        CardNumber: result.CardNumber,
        CardType: result.CardType,
        ExpirationDate: result.ExpirationDate,
        CVV: result.CVV,
        IsActive: result.IsActive,
        FirstName: result.FirstName, // Include First Name
        LastName: result.LastName      // Include Last Name
      }));

      callback(null, bankCards);
    });
  },
//joining customer table and bankcard to get customer information

getCustCardDetailsByAccountID: (AccountID, callback) => {
  const sql = `
    SELECT 
      c.CustID_Nr, 
      c.FirstName, 
      c.LastName, 
      c.Email, 
      c.PhoneNumber,
      bc.CardNumber, 
      bc.CVV, 
      bc.ExpirationDate
    FROM bankcard bc
    JOIN customer c ON bc.AccountID = c.AccountID
    WHERE bc.AccountID = ?`;

  db.query(sql, [AccountID], (err, result) => {
    if (err) {
      return callback(new Error('Failed to retrieve customer and card details: ' + err.message));
    }
    if (result.length > 0) {
      const customer = {
        CustID_Nr: result[0].CustID_Nr,
        FirstName: result[0].FirstName,
        LastName: result[0].LastName,
        Email: result[0].Email,
        PhoneNumber: result[0].PhoneNumber,
        CardNumber: result[0].CardNumber,
        CVV: result[0].CVV,
        ExpirationDate: result[0].ExpirationDate,
      };
      return callback(null, customer);
    }
    callback(null, null); // Customer not found
  });
}

};

module.exports = BankCardDAO;
