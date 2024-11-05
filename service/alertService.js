const AlertDAO = require('../DAO/alertDAO');

const AlertService = {
    createLocation: (locationData, callback) => {
        if(!locationData){
            return callback(new Error('location data is required'));
        }
        else{
            AlertDAO.createLocation(locationData, (err,result) =>{
                if(err){
                    return callback(new Error('Failed to create Location: ' + err.message));
                }
                callback(null, result);
                
            });

        }
    },
    createAlert: (alertData, callback)=>{
        if(!alertData){
            return callback(new Error('Alert data is required'));
        }else{
            AlertDAO.createAlert(alertData, (err,result)=>{
                if(err){
                    return callback(new Error('Failed to create Alert: ' + err.message));
                }
                callback(null, result);
            });
        }
    }
}
module.exports = AlertService;