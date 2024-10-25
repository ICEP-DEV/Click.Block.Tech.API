const NotificationService = require('../service/notificationService');
const TransactionDAO = require('../DAO/transactionDAO');
const BankAccountDAO = require('../DAO/bankAccountDAO');
const Transaction = require('../models/transaction');

class TransactionService {
  // Attempt to create a transaction that requires approval
  async processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID) {
    return new Promise((resolve, reject) => {
      TransactionDAO.getCustomerByCardNumber(cardNumber, (err, customer) => {
        if (err) return reject(new Error('Error fetching customer.'));
        if (!customer) return reject(new Error('Customer not found.'));

        TransactionDAO.verifyPin(customer.CustID_Nr, pin, (err, isPinValid) => {
          if (err) return reject(new Error('Error verifying PIN.'));
          if (!isPinValid) return reject(new Error('Invalid PIN.'));

          const validTransactionTypes = ['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'];
          const status = validTransactionTypes.includes(transactionType) ? 'Pending' : 'Completed';

          if (status === 'Completed') {
            // If the transaction does not require approval, directly update the balance and save it
            this.updateBankAccountBalance(customer.AccountID, transactionType, transactionAmount)
              .then(() => {
                const transaction = new Transaction(
                  null,
                  customer.AccountID,
                  transactionType,
                  new Date(),
                  transactionAmount,
                  'Completed',
                  false,
                  null
                );
                return TransactionDAO.createTransaction(transaction, (err, transactionID) => {
                  if (err) return reject(new Error('Error creating transaction.'));
                  resolve({ transactionID, message: 'Transaction completed successfully' });
                });
              })
              .catch((err) => reject(new Error('Error updating bank account balance.')));
          } else {
            // If the transaction requires approval, hold off on saving it until approved
            const pendingTransaction = new Transaction(
              null,
              customer.AccountID,
              transactionType,
              new Date(),
              transactionAmount,
              'Pending',
              false,
              null
            );

            // Save the pending transaction to the database and retrieve its ID
            TransactionDAO.createPendingTransaction(pendingTransaction, (err, transactionID) => {
              if (err) return reject(new Error('Error saving pending transaction.'));
              resolve({ transactionID, message: 'Transaction created and awaiting approval' });
            });
          }
        });
      });
    });
  }

  // Approve a pending transaction, then save it in the database
  async approveTransaction(transactionID) {
    try {
      await NotificationService.updateNotificationStatus(transactionID, 'Approved');

      const transaction = await TransactionDAO.getTransactionById(transactionID);
      if (!transaction) throw new Error('Transaction not found');

      // Update balance only for withdrawal-type transactions
      const withdrawalTypes = ['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'];
      if (withdrawalTypes.includes(transaction.TransactionType)) {
        await this.updateBankAccountBalance(transaction.AccountID, transaction.TransactionType, transaction.Amount);
      }

      // After updating balance, update status to completed and save in database
      await TransactionDAO.updateTransactionStatus(transactionID, 'Completed');
      return { message: 'Transaction approved, processed, and saved to the database', transactionID };
    } catch (error) {
      console.error('Error approving transaction:', error);
      throw new Error('Failed to approve transaction');
    }
  }

  // Update bank account balance
  async updateBankAccountBalance(accountID, transactionType, transactionAmount) {
    return new Promise((resolve, reject) => {
      BankAccountDAO.getById(accountID, (err, bankAccount) => {
        if (err) return reject(new Error('Failed to retrieve bank account.'));
        if (!bankAccount) return reject(new Error('Bank account not found'));

        let newBalance = bankAccount.Balance;
        if (['Cash Transfer', 'EFT', 'Online Purchase', 'Cash Payment', 'Payment Order'].includes(transactionType)) {
          newBalance -= transactionAmount;
        } else {
          newBalance += transactionAmount;
        }

        BankAccountDAO.update(accountID, { Balance: newBalance }, (err, result) => {
          if (err) return reject(new Error('Failed to update bank account balance.'));
          resolve();
        });
      });
    });
  }
}

module.exports = new TransactionService();
