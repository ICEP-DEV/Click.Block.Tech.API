const db = require('../config/config');

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
      }
}
module.exports = AlertDAO;
