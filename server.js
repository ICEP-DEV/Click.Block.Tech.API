const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');
const adminRoutes = require('./route/adminRoutes');
const supportingDocumentRoutes = require('./route/supportingDocumentRoutes');
const bankAccountRoutes = require('./route/bankAccountRoutes'); 
const notificationRoutes = require('./route/notificationRoutes');
const bankCardRoutes =  require('./route/bankCardRoutes'); 
const transactionRoutes = require('./route/transactionRoutes');  // Import transaction routes

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); // Use express' built-in URL-encoded parser
app.use(cors());


app.use('/api', customerRoutes);
app.use('/api', adminRoutes);
//app.use('/api', supportingDocumentRoutes);
app.use('/api', bankAccountRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', bankCardRoutes);
app.use('/api', transactionRoutes);  // Use transaction routes



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});