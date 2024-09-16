//configuring the server
const express = require('express');
const cors = require('cors');
const customerRoutes = require('./route/customerRoutes');
// body parser: Submttions handled by body-parse
const bodyParser = require('body-parser')



const app = express();

// configuring the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.json()); 

//configure cors
app.use(cors());  

app.use('/api', customerRoutes);

app.use('/' , require('./route/customerRoutes'))
 /* for testing on postman
app.use('/', (req,res) => {
  res.send('Endpoint...1234')
});
*/
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
