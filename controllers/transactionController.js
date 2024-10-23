const transactionService = require('../service/transactionService'); // Import the service layer

// Define the function to handle the transaction
const handleTransaction = async (req, res) => {
    try {
        // Extract data from the request body
        const { cardNumber, pin, transactionType, transactionAmount, locationID } = req.body;

        // Call the service layer to process the transaction
        const transaction = await transactionService.processTransaction(cardNumber, pin, transactionType, transactionAmount, locationID);

        // Send the successful response
        res.status(200).json({ message: 'Transaction successful', transaction });
    } catch (error) {
        // Log and send error response
        console.error('Error processing transaction:', error.message);
        res.status(500).json({ error: 'Transaction processing failed', details: error.message });
    }

    
}

// Export the controller function
module.exports = { handleTransaction };
