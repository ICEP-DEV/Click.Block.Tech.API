const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'clickblocktech@gmail.com', 
    pass: 'cwyi dbqh ajys lept' 
  }
});


const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: 'clickblocktech@gmail.com',
    to: email,
    subject: 'Nexis Bank Verification OTP',
    text: `Your OTP code is: ${otp}`
  };


  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail }; 
