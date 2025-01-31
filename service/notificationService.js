const NotificationDao = require('../DAO/notificationDAO');

const NotificationService = {
    createNotification : (notificationData, callback)=>{
        if(!notificationData){
            callback(new Error('notificationData is required'));
        }
        NotificationDao.createNotification(notificationData, callback);
    },

    getNotificationByStatus : (status, callback)=>{
       
        if(!status){
            callback(new Error('status is required'));
        }
    
        NotificationDao.getNotificationsByStatus(status, callback);
       
    },
    updateNotificationStatus(status,transactionId, callback){
        
        NotificationDao.updateNotificationStatus(status,transactionId, callback);
        
    }
}
module.exports = NotificationService;
