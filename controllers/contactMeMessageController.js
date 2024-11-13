const ContactMeMessageService = require('../service/contactMeMessageService');

const getMessageById = (req, res) => {
  ContactMeMessageService.getMessageById(req.params.MessageID, (err, message) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(message);
  });
};

const getMessagesByCustomerID = (req, res) => {
  ContactMeMessageService.getMessagesByCustomerID(req.params.CustID_Nr, (err, messages) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No documents found for this customer' });
    }
    res.status(200).json(messages);
  });
};

// Improved getAllMessages method
const getAllMessages = (req, res) => {
  ContactMeMessageService.getAllMessages((err, messages) => {
    if (err) return res.status(500).json({ error: err.message });
    // Return an empty array if no messages found, instead of 404
    res.status(200).json(messages || []);
  });
};

module.exports = {
  getMessageById,
  getMessagesByCustomerID,
  getAllMessages
};
