const db = require('../config/config'); 

class TransactionDAO {
    async getCustomerByCardNumber(cardNumber) {
        try {
            // Log the card number received
            console.log('Card Number:', cardNumber);

            const sqlQuery = `git
                SELECT c.CustID_Nr 
                FROM BankCard bc 
                INNER JOIN BankAccount b ON bc.AccountID = b.AccountID 
                INNER JOIN Customer c ON b.AccountID = c.AccountID 
                WHERE TRIM(bc.CardNumber) = ?
            `;

            // Log the SQL query before execution
            console.log('Executing SQL Query:', sqlQuery);

            // Execute the query
            const result = await db.query(sqlQuery, [cardNumber]);
            console.log('Raw Query Result:', result);

            // Check if result is an array and has data
            const rows = Array.isArray(result) ? result : [result]; // Ensure it's in array format
            
            if (Array.isArray(rows) && rows.length > 0) {
                console.log('Customer found: CustID_Nr:', rows[0].CustID_Nr);
                return rows[0]; // Return the first matching customer
            } else {
                console.log('No matching customer found in the query result.');
                throw new Error('No matching customer found.');
            }
        } catch (error) {
            console.error('Error fetching customer by card number:', error);
            throw error; // Rethrow the error to be handled elsewhere
        }
    }
}

module.exports = new TransactionDAO();
