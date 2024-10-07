const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'goldstainmusic22@gmail.com', 
    pass: 'kgsa tkjx ugfq qrko' 
  }
});


const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: 'goldstainmusic22@gmail.com',
    to: email,
    subject: 'Nexis Bank Verification OTP',
    text: `Your OTP code is: ${otp}`
  };


  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail }; 
