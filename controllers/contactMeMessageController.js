const ContactMeMessageService = require('../service/contactMeMessageService');

const createMessage = (req, res) => {
  const messageData = req.body;
  ContactMeMessageService.createMessage(messageData, (err, messageID) => {
    if (err) return res.status(500).json({ error: 'Failed to create message', message: err.message });
    res.status(201).json({ MessageID: messageID, SentTime: new Date() }); // Include SentTime in the response
  });
};


const getMessage = (req, res) => {
  const MessageID = req.params.messageID;
  ContactMeMessageService.getMessageById(MessageID, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve message', message: err.message });
    if (!result) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(result); // Ensure SentTime is included in the response
  });
};

const updateMessageStatus = (req, res) => {
  const MessageID = req.params.messageID;
  const status = req.body.status;
  ContactMeMessageService.updateMessageStatus(MessageID, status, (err, success) => {
    if (err) return res.status(500).json({ error: 'Failed to update status', message: err.message });
    if (!success) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json({ message: 'Status updated successfully' });
  });
};

const deleteMessage = (req, res) => {
  const MessageID = req.params.messageID;
  ContactMeMessageService.deleteMessage(MessageID, (err, success) => {
    if (err) return res.status(500).json({ error: 'Failed to delete message', message: err.message });
    if (!success) return res.status(404).json({ error: 'Message not found' });
    res.status(204).json({ message: 'Message deleted successfully' });
  });
};

const getAllMessages = (req, res) => {
  ContactMeMessageService.getAllMessagess((err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to retrieve messages', message: err.message });
      if (results.length == 0) {
          return res.status(404).json({ message: 'No messages found' });
      }
      res.status(200).json(results);
  });
};

module.exports = {
  createMessage,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  getAllMessages
};
