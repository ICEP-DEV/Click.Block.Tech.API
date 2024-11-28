const db = require('../config/config');
const BankCard = require('../models/bankCard')
const AtmDAO = {
    verifyCardNum: (cardNumber, callback) =>{
        const sql = 'SELECT * FROM bankcard WHERE CardNumber = ?';
    db.query(sql, [cardNumber], (err, result) => {
      if (err) {
        callback(err, null);
      } else {

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
          callback(null, bankCard);
        } else {
          callback(null, false);  
        }
      }
    });
    }
}
module.exports = AtmDAO;