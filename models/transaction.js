class Transaction {
  constructor(transactionID, accountID, transactionType, transactionDate, transactionAmount, status, locationID) {
      this.transactionID = transactionID;
      this.accountID = accountID;
      this.transactionType = transactionType;
      this.transactionDate = transactionDate;
      this.transactionAmount = transactionAmount;
      this.status = status;
      this.locationID = locationID;
  }

}

module.exports = Transaction;
