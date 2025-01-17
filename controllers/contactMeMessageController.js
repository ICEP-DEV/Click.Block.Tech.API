
const ContactMeMessageService = require('../service/contactMeMessageService');

const createMessage = (req, res) => {
  const messageData = req.body;
  ContactMeMessageService.createMessage(messageData, (err, messageID) => {
    if (err) return res.status(500).json({ error: 'Failed to create message', message: err.message });
    res.status(201).json({ MessageID: messageID, SentTime: new Date() }); // Include SentTime in the response
  });
};

const getChatBotResponse  = async (req, res)  =>{
  const prompt = req.body;
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI("AIzaSyDODFo_ijTlgWCxtqebqvEEcvT6jfBQYmM");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(
    `**prompt:** **User Question:**  {${prompt.prompt}}\n\n**App Description:** Our app enhances your banking app's security by implementing a two-pin system to combat kidnapping-related financial threats prevalent in South Africa. \n* **Emergency Pin:** Used to lock your account and alert authorities during a kidnapping. \n* **Regular Pin:** For everyday transactions. \n\n**Features:**\n* **Kidnap Protection:** Prevents unauthorized fund transfers during emergencies. \n* **Transaction Safety:** Enhances security for all transactions within the banking app. \n\n**Pricing:** Our platform is currently **free** to use. \n\n**Registration:** Requires basic personal information and image authentication. \n\n**Panic Feature Activation:** Requires setting a unique panic pin once. \n\n**User Question:** {${prompt.prompt}}\n\n**Answer:** Based on the provided app description and user question, please provide a comprehensive and informative response. If the user's question requires technical support or troubleshooting, kindly advise them to contact our admin team.**Create a short answer with paragraph of 4 lines`,
  );
  res.status(201).json({response: `${result.response.text()}`})
}

 
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
  getAllMessages,
  getChatBotResponse
};
