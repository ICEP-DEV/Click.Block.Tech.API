const AlertDAO = require('../DAO/alertDAO');
const AlertEmailService = require('./alert_email_service');
const opt_email_alert = require('./opt_alert_emailService');
const AlertPinLogService = require('./alertPinLogService');
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
                const location = `
                StreetAddress: ${locationData.StreetAddress}
                Suburb: ${locationData.Suburb}
                City: ${locationData.City}
                Province: ${locationData.Province}
                PostalCode: ${locationData.PostalCode}
                Country: ${locationData.Country}
                Track live location: https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}
                `;
                //Since we are still on a free trial of mailtrap, I've commented the AlertEmailService method.
                //Please only enable it when its needed like during "show and tell" and final project presentation.
                //If you don't follow my instruction your on you own.
                //Only remove comments on below function if the opt_alert_emailSevice is not working
                //AlertEmailService.alertEmailService(location);
                opt_email_alert.alertEmailService(location)
                .then(() =>  callback(null, result))
                .catch(emailErr => callback({ status: 500, message: 'Failed to send Emergency alert' + emailErr.message }));

               
                
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

                // Log the alert pin usage in AlertPinLog
            AlertPinLogService.logPin(alertData, (logErr) => {
                if (logErr) {
                    console.error('Error logging alert pin usage:', logErr.message);
                }
            });
            
                callback(null, result);
            });
        }
    }
}
module.exports = AlertService;