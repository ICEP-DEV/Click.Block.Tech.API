const mysql = require('mysql');
const AWS = require('aws-sdk');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'click_block_tech',  
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

AWS.config.update({
  region: 'your-region', 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sns = new AWS.SNS();

module.exports = { db, sns };
