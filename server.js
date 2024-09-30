const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');
const bankAccountRoutes = require('./route/bankAccountRoutes'); 

const app = express();

// configuring the body parser 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); // Use express' built-in URL-encoded parser

// configure CORS
app.use(cors());

// Use customer routes
app.use('/api', customerRoutes);

// Use bankAccount routes
app.use('/api', bankAccountRoutes);

/* for testing on postman
app.use('/', (req, res) => {
  res.send('Endpoint...1234');
});
*/

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
