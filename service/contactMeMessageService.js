const ContactMeMessageDAO = require('../DAO/contactMeMessageDAO');

const ContactMeMessageService = {
  getMessageById: (MessageID, callback) => {
    ContactMeMessageDAO.getById(MessageID, callback);
  },

  getMessagesByCustomerID: (CustID_Nr, callback) => {
    ContactMeMessageDAO.getByCustomerID(CustID_Nr, callback);
  },

  getAllMessages: (callback) => {
    ContactMeMessageDAO.getAll(callback);
  }
};

module.exports = ContactMeMessageService;
