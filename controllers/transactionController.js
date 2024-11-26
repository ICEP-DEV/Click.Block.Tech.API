const TransactionService = require('../service/transactionService');
const NotificationService = require('../service/notificationService'); // Import NotificationService
const CustomerService = require('../service/customerService');
const transactionService = require('../service/transactionService');
const { json } = require('express');
class TransactionController {

  
  async processTransaction(req, res) {
    try {
      const { cardNumber, pin, transactionType, transactionAmount } = req.body;
      
      const bcrypt = require('bcryptjs');
       CustomerService.getAccIDByCardNum(cardNumber,(err, customerByCardNr) => {
        if(err){
          return res.status(500).send(err);
        }
        if(customerByCardNr){
          console.log(customerByCardNr);
        const accountID = customerByCardNr.AccountID;
        console.log(accountID)
        //getting customer using the account ID
           CustomerService.getbyAccountID(accountID, (err, customer) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
    
            if (customer) {
                //matching input password with the hashed password
                bcrypt.compare(pin, customer._LoginPin, (err, result) => {
                    if (err) {
                        // Handle error
                        console.error('Error comparing passwords:', err);
                        return;
                    }
             
                    if (result) {
                    // Passwords match, authentication successful
                    console.log('Remote PINS match');
                      const status = "pending";
                      const dateNow = new Date();
                     TransactionService.processTransaction(cardNumber, transactionType, transactionAmount,status,dateNow,(result)=>{
                      if(result){
                        NotificationService.createNotification({
                          TransactionID: result.transactionID,
                          NotificationType: "Withdrawal",
                          SentDate: dateNow,
                          status: status
                        },(err, result)=>{
                          if(err){
                            console.log('err')
                          }else{
                            console.log('Created notification');
                          }
                        })
                      }
                     
                      return res.status(200).send(result);
                    });
                    } else {
                    // Passwords don't match, authentication failed
                    console.log('Remote PINS dont match');
                    res.status(200).send(result);
                    }
                });
                
            }else{
                res.status(404).send({ error: 'Customer not found' });
            }
           
          });
        }else{
          res.status(200).send(null);
        }
      });
     
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionsByAccID(req, res){
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

  async approveTransaction(req, res) {
    try {
      const { transactionId } = req.body;
      console.log('Received transactionId:', transactionId);

      // Get the notification status for the transaction
      const notificationStatus = await NotificationService.getNotificationStatus(transactionId);
      console.log('Notification status:', notificationStatus);

      if (notificationStatus === 'Approved') {
        const result = await TransactionService.approveTransaction(transactionId);
        console.log('Transaction approval result:', result);
        res.status(200).json(result);
      } else if (notificationStatus === 'Declined') {
        // Handle declined logic if needed
        res.status(200).json({ message: 'Transaction declined.' });
      } else {
        // Handle case if the status is neither 'Approved' nor 'Declined'
        res.status(400).json({ error: 'Invalid notification status for this transaction.' });
      }
    } catch (error) {
      console.error('Error in approving transaction:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async updateTransactionStatus(req, res){
    const {status, transactionID} = req.body;
    const result = await transactionService.updateTransactionStatus(status, transactionID);
    res.status(200).json({message: "Transaction updated"})
  }
  updateBankBalance(req,res){
    const {accountID, transactionAmnt} = req.body;
     transactionService.updateBankAccountBalance(accountID, transactionAmnt, (err, result)=>{
      const status = JSON.stringify(result.message);
      
      if(status){
        res.status(200).json({message: "Balance updated"})
      }else{
        res.status(200).json({message: "Insufficient funds"})
      }
      
    });
  }
}

module.exports = new TransactionController();
