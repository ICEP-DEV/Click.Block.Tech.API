const db = require('../config/config'); 

const BankAccountDAO = {
    create: (bankAccountData, callback) => {
        const query = `
            INSERT INTO BankAccount (AccountNr, ExpirationDate, AccountType, Balance, CreationDate, isActive)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const { AccountNr, ExpirationDate, AccountType, Balance, CreationDate, isActive } = bankAccountData;

        db.query(
            query,
            [AccountNr, ExpirationDate, AccountType, Balance, CreationDate, isActive],
            (err, result) => {
                if (err) {
                    console.error('Error creating bank account:', err);
                    return callback(err);
                }

                console.log('Bank account created successfully:', result);
                callback(null, result);
            }
        );
    }
};

module.exports = BankAccountDAO;
