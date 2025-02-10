const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'clickblocktech@gmail.com', 
    pass: 'tokk ewzn lntj dpes' 
  }
});


const sendAccountInfoEmail = (email, accInfo) => {
  const mailOptions = {
    from: 'clickblocktech@gmail.com',
    to: email,
    subject: 'Welcome to Nexis (Account Information',
    text: `Your account information:
          Account Number: ${accInfo.AccountNr}
          Account Type: ${accInfo.AccountType}
          Account Creation Date: ${accInfo.CreationDate}
          Expiration date: ${accInfo.ExpirationDate}
          Demo Balance: R${accInfo.Balance}
  `
  };


  return transporter.sendMail(mailOptions);
};

module.exports = { sendAccountInfoEmail }; 
