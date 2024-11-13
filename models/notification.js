class Notification {
    constructor(id, transactionId, notificationType, sentDate, status) {
        this.id = id;
        this.transactionId = transactionId;
        this.notificationType = notificationType;
        this.sentDate = sentDate;
        this.status = status;
    }
}

module.exports = Notification;