const AlertDAO = require('../DAO/alertDAO');
const AlertEmailService = require('./alert_email_service');

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
                //Sending Panic Alert email
                //Since we are still on a free version, please comment the  AlertEmailService method.
                const location = `StreetAddress: ${locationData.StreetAddress}.
                Suburb: ${locationData.Suburb}
                City: ${locationData.City}
                Province: ${locationData.Province}
                PostalCode: ${locationData.PostalCode}
                Country: ${locationData.Country}
                `;
                AlertEmailService.alertEmailService(location);
                
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