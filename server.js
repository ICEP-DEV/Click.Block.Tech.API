const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');

const app = express();
app.use(express.json()); 
app.use(cors());  

app.use('/api', customerRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
