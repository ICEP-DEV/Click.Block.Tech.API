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
    from: 'clickblocktech@gmail.com',
    to: email,
    subject: 'Nexis Bank Verification OTP',
    text: `Your OTP code is: ${otp}`
  };

  return transporter.sendMail(mailOptions);
};

const sendEmailWithPdf = (email, pdfBase64) => {
  const mailOptions = {
    from: 'clickblocktech@gmail.com',
    to: email,
    subject: 'Nexis Bank - Requested Statement Attached',
    text: 'Please find the attached document.',
    attachments: [
      {
        filename: 'bank_statement.pdf',
        content: pdfBase64,
        encoding: 'base64',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail, sendEmailWithPdf };
