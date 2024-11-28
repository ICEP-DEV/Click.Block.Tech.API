const db = require('../config/config');
const Alert = require('../models/alert');

const AlertDAO = {
    createLocation: (locationData, callback) => {
        const sql = 'INSERT INTO location SET ?';
        db.query(sql, locationData, (err, result) => {
          if (err) {
            return callback(new Error('Failed to create location: ' + err.message));
          }
          callback(null, { id: result.insertId, ...locationData });
        });
      },

      createAlert: (alertData, callback) =>{
        const sql = 'INSERT INTO alert SET ?';
        db.query(sql, alertData, (err, result)=>{
            if(err){
                return callback(new Error('Failed to create Alert:' + err.message));
            }
            callback(null, {id: result.insertId, ...alertData});
        });
      },
      updateFields: (custID_Nr, updateData, callback) => {
        const sql = 'UPDATE customer SET ? WHERE CustID_Nr = ?';
    
        db.query(sql, [updateData, custID_Nr], (err, result) => {
          if (err) {
            console.error('Error updating customer:', err);
            return callback({ status: 500, message: 'Database error' });
          }
          console.log('Update result:', result);
          callback(null, result);
        });
      },
      //updating latitude and longitude
      updateLatLong: (locationID, updateData, callback) => {
        const sql = 'UPDATE location SET ? WHERE LocationID = ?';
    
        db.query(sql, [updateData, locationID], (err, result) => {
          if (err) {
            console.error('Error updating Latitude and Longitude:', err);
            return callback({ status: 500, message: 'Database error' });
          }
          console.log('Update result:', result);
          callback(null, result);
        });
      },
      getAlertLocationID: (CustID_Nr, callback)=>{
        const sql = 'SELECT * FROM alert WHERE CustID_Nr = ?';
        db.query(sql, [CustID_Nr], (err, result) =>{
          if(err){
            callback(err, null);
          }else{
            if(result.length > 0){
              const alert = new Alert(
              result[0].AlertID,
              result[0].CustID_Nr,
              result[0].AlertType,
              result[0].SentDate,
              result[0].LocationID,
              result[0].Receiver,
              result[0].Message,
              );
              callback(null, alert);
            } else {
              callback(null, null);  
            }
          }
        });
       },
}
module.exports = AlertDAO;
