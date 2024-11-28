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

const updateNotificationStatus = (req,res)=>{
    const {status, transactionID} = req.body;
    NotificationService.updateNotificationStatus(status,transactionID, (err, result)=>{
        if(err){
            return res.status(500).send({ error: err.message });
        }
        res.status(200).json({message: "Notification updated"})
    });
    
}
module.exports = {createNotification, getNotificationByStatus, updateNotificationStatus}
