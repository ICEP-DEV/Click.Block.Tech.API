const TransactionService = require('../service/transactionService');
const NotificationService = require('../service/notificationService'); // Import NotificationService
const transactionService = require('../service/transactionService');

  const createTransaction =(req, res) =>{
    const {transactionType, transactionAmount, accountID } = req.body;
    try {
      const status = "pending";
      
     TransactionService.createTransaction(transactionType, transactionAmount,status,dateNow,accountID,(transacResult)=>{
      if(transacResult){
        NotificationService.createNotification({
          TransactionID: transacResult.transactionID,
          NotificationType: transactionType,
          SentDate: new Date(),   
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

  const updateAccountBalance = (req, res)=>{
    const {accountID, requestedAmount} = req.body;
    transactionService.getBankAccount(accountID, (result)=>{
      
        const availableBalance = result.Balance;
        console.log(typeof(requestedAmount));
        const newBalance = availableBalance - requestedAmount;
        transactionService.updateAccountBalance(accountID, newBalance,(result)=>{
         
        });
        res.status(200).json(result);
    });
  }
  const getTransactionByID = (req, res)=>{
    const transactionID = req.params.transactionID;
 transactionService.getTransactionByID(transactionID, (result)=>{
      res.status(200).json(result);
  });
  }
const updateTransacPanicStatus = (req, res)=>{
  const {transactionId, status} = req.body;

  transactionService.updateTransacPanicStatus(transactionId, status, (result)=>{
    res.status(200).json(result);
  })
}


  module.exports = {updateTransacPanicStatus,createTransaction, getTransactionsByAccID, updateTransactionStatus, getBankAccount, updateAccountBalance,getTransactionByID}
