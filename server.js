const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');
const adminRoutes = require('./route/adminRoutes');
const supportingDocumentRoutes = require('./route/supportingDocumentRoutes');

const app = express();
app.use(express.json()); 
app.use(cors());  

app.use('/api', customerRoutes);
app.use('/api', adminRoutes);
app.use('/api', supportingDocumentRoutes);


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
