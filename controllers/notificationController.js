const NotificationService = require('../service/notificationService');


const createNotification = (req, res) =>{
    const notificationData = req.body;
    if(!notificationData.TransactionID || !notificationData.NotificationType || !notificationData.SentDate || !notificationData.Status){
        return res.status(400).send({ error: "notification details are required"})
    }
    NotificationService.createNotification(notificationData, (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(201).send(result);
    });
}

const getNotificationByStatus = (req,res)=>{
    const status = req.params.status;

    if(!status){
        return res.status(400).send({ error: "transaction status required"})
    }
    
   NotificationService.getNotificationByStatus(status, (err, result)=>{
    if(err){
        return res.status(500).send({ error: err.message });
    }
   
    res.status(201).send(result);
   });
}
module.exports = {createNotification, getNotificationByStatus}
