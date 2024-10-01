const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');
const adminRoutes = require('./route/adminRoutes');
const supportingDocumentRoutes = require('./route/supportingDocumentRoutes');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', customerRoutes);
app.use('/api', adminRoutes);
app.use('/api', supportingDocumentRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
