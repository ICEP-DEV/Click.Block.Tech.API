const TransactionService = require('../service/transactionService');
const NotificationService = require('../service/notificationService');
const emailService = require('../service/emailService');


const createTransaction = (req, res) => {
  const { transactionType, transactionAmount, accountID } = req.body;
  try {
    const status = "pending";
    const dateNow = new Date();
    TransactionService.createTransaction(transactionType, transactionAmount, status, dateNow, accountID, (transacResult) => {
      if (transacResult) {
        NotificationService.createNotification({
          TransactionID: transacResult.transactionID,
          NotificationType: transactionType,
          SentDate: dateNow,
          status: status
        }, (err, result) => {
          if (err) {
            console.log(transacResult);
          }
        });
      }
      res.status(200).send(transacResult);
    });
  } catch (err) {
    console.log(err);
  }
};

const getTransactionsByAccID = (req, res) => {
  try {
    const accountID = req.params.accountID;
    const status = req.params.status;
    TransactionService.getTransactionByAccID(accountID, status, (result) => {
      res.status(201).send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllTransactionsByAccID = (req, res) => {
  try {
    const accountID = req.params.accountID;
   
    TransactionService.getAllTransactionByAccID(accountID, (result) => {
      res.status(200).send(result);

    });
  } catch (err) {
    console.log(err);
  }
};

const updateTransactionStatus = (req, res) => {
  const { status, transactionID } = req.body;
  TransactionService.updateTransactionStatus(status, transactionID);
  res.status(200).json({ message: "Transaction updated" });
};

const getBankAccount = (req, res) => {
  const accID = req.params.accountID;
  TransactionService.getBankAccount(accID, (result) => {
    res.status(200).json(result);
  });
};

const updateAccountBalance = (req, res) => {
  const { accountID, requestedAmount } = req.body;
  TransactionService.getBankAccount(accountID, (result) => {
    const availableBalance = result.Balance;
    const newBalance = availableBalance - requestedAmount;
    TransactionService.updateAccountBalance(accountID, newBalance, (result) => {});
    res.status(200).json(result);
  });
};

const getTransactionByID = (req, res) => {
  const transactionID = req.params.transactionID;
  TransactionService.getTransactionByID(transactionID, (result) => {
    res.status(200).json(result);
  });
};

const updateTransacPanicStatus = (req, res) => {
  const { transactionId, status } = req.body;
  TransactionService.updateTransacPanicStatus(transactionId, status, (result) => {
    res.status(200).json(result);
  });
};

const fetchTransactions = (req, res) => {
  const { accountId, startDate, endDate } = req.query;
  if (!accountId || !startDate || !endDate) {
    return res.status(400).json({ status: 400, message: 'Missing required parameters' });
  }

  TransactionService.fetchTransactions(accountId, startDate, endDate, (err, transactions) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ status: 500, message: 'Failed to fetch transactions' });
    }
    res.status(200).json(transactions);
  });
};

const sendEmailWithPdf = async (req, res) => {
  try {
    const { email, pdfBase64 } = req.body;
    if (!email || !pdfBase64) {
      return res.status(400).json({ message: 'Email and PDF are required' });
    }

    await emailService.sendEmailWithPdf(email, pdfBase64);
    res.json({ message: 'Email with PDF sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
};

module.exports = {
  updateTransacPanicStatus,
  createTransaction,
  getTransactionsByAccID,
  getAllTransactionsByAccID,
  updateTransactionStatus,
  getBankAccount,
  updateAccountBalance,
  getTransactionByID,
  fetchTransactions,
  sendEmailWithPdf
};
