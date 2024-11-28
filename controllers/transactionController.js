const TransactionService = require('../service/transactionService');
const NotificationService = require('../service/notificationService'); // Import NotificationService
const transactionService = require('../service/transactionService');

  const createTransaction =(req, res) =>{
    const {transactionType, transactionAmount, accountID } = req.body;
    try {
      const status = "pending";
      const dateNow = new Date();
     TransactionService.createTransaction(transactionType, transactionAmount,status,dateNow,accountID,(transacResult)=>{
      if(transacResult){
        NotificationService.createNotification({
          TransactionID: transacResult.transactionID,
          NotificationType: transactionType,
          SentDate: dateNow,
          status: status
        },(err, result)=>{
          if(err){
            console.log(transacResult)
          }else{
        
          }
        })
      }
      res.status(200).send(transacResult);
    });

    }catch(err){
      console.log(err);
    }
  }

  const getTransactionsByAccID = (req, res) =>{
    try{
      const accountID = req.params.accountID;
      const status = req.params.status;
      transactionService.getTransactionByAccID(accountID,status, (result)=>{
          
           res.status(201).send(result);
      })
    }catch(err){
      console.log(err);
    }
  }

 const updateTransactionStatus = (req, res)=> {
    const {status, transactionID} = req.body;
     transactionService.updateTransactionStatus(status, transactionID);
    res.status(200).json({message: "Transaction updated"})
  }

  const getBankAccount = (req, res)=>{
    const accID = req.params.accountID;
    transactionService.getBankAccount(accID, (result)=>{
      res.status(200).json(result);
    });
  }



  module.exports = {createTransaction, getTransactionsByAccID, updateTransactionStatus, getBankAccount}
