const db = require('../config/config');

const AtmDAO = {
    verifyCardNum: (cardNumber, callback) =>{
        const sql = 'SELECT * FROM bankcard WHERE CardNumber = ?';
    db.query(sql, [cardNumber], (err, result) => {
      if (err) {
        callback(err, null);
      } else {

        if (result.length > 0) {
          
          callback(null, true);
        } else {
          callback(null, false);  
        }
      }
    });
    }
}