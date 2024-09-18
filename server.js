// configuring the server
const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');
const bankAccountRoutes = require('./route/bankAccountRoutes'); // Import bankAccount routes
const bodyParser = require('body-parser');

const app = express();

// configuring the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json()); 

// configure CORS
app.use(cors());

// Use customer routes
app.use('/api', customerRoutes);

// Use bankAccount routes
app.use('/api', bankAccountRoutes);  // Add this line to include bankAccount routes

/* for testing on postman
app.use('/', (req, res) => {
  res.send('Endpoint...1234');
});
*/

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
