const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'clickblocktechemergencyalert@gmail.com', 
    pass: 'neme tezw vxme gcsm' 
  }
});


const alertEmailService = (location) => {
  const mailOptions = {
    from: 'clickblocktechemergencyalert@gmail.com',
    to: 'clickblocktechemergencyalert@gmail.com',
    subject: 'Emergency Alert button Triggered',
    text: `Emergency alert is triggered at:
     ${location}`,
  };


  return transporter.sendMail(mailOptions);
};

module.exports = { alertEmailService }; 
