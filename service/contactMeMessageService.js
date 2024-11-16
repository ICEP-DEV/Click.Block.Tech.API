const ContactMeMessageDAO = require('../DAO/contactMeMessageDAO');

const ContactMeMessageService = {
  createMessage: (messageData, callback) => {
    if (!messageData.CustID_Nr || !messageData.FullNames || !messageData.PhoneNumber || !messageData.Email) {
      return callback(new Error('All required fields must be provided.'));
    }

    ContactMeMessageDAO.create(messageData, (err, messageID) => {
      if (err) return callback(new Error('Failed to create message: ' + err.message));
      callback(null, messageID);
    });
  },

  getMessageById: (MessageID, callback) => {
    ContactMeMessageDAO.getById(MessageID, (err, result) => {
      if (err) return callback(new Error('Failed to retrieve message: ' + err.message));
      callback(null, result);
    });
  },

  updateMessageStatus: (MessageID, status, callback) => {
    ContactMeMessageDAO.updateStatus(MessageID, status, (err, result) => {
      if (err) return callback(new Error('Failed to update status: ' + err.message));
      callback(null, result);
    });
  },

  deleteMessage: (MessageID, callback) => {
    ContactMeMessageDAO.delete(MessageID, (err, result) => {
      if (err) return callback(new Error('Failed to delete message: ' + err.message));
      callback(null, result);
    });
  },

  getAllMessagess: (callback) => {
    ContactMeMessageDAO.getAll((err, results) => {
      if (err) return callback(new Error('Failed to retrieve messages: ' + err.message));
      callback(null, results);
    });
  }
};

module.exports = ContactMeMessageService;
