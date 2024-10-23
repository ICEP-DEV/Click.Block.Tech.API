const db = require('../config/config'); // Assuming you have a database connection file

class TransactionDAO {
    // Method to fetch customer by card number and PIN
    async getCustomerByCardNumberAndPin(cardNumber, pin) {
        const query = `
            SELECT c.CustID_Nr
            FROM BankCard bc
            INNER JOIN BankAccount b ON bc.AccountID = b.AccountID
            INNER JOIN Customer c ON b.AccountID = c.AccountID
            WHERE bc.CardNumber = ? AND c.LoginPin = ?
        `;
        const [customer] = await db.query(query, [cardNumber, pin]);
        return customer;
    }

    // Method to fetch account by customer ID
    async getAccountByCustomerID(custID) {
        const query = `SELECT * FROM BankAccount WHERE AccountID = ?`;
        const [account] = await db.query(query, [custID]);
        return account;
    }

    // Method to create a transaction
    async createTransaction(accountID, transactionType, transactionAmount, locationID) {
        const query = `
            INSERT INTO Transaction (AccountID, TransactionType, TransactionDate, TransactionAmount, Status, LocationID)
            VALUES (?, ?, NOW(), ?, 'Pending', ?)
        `;
        const result = await db.query(query, [accountID, transactionType, transactionAmount, locationID]);
        return result;
    }
}

module.exports = new TransactionDAO();
