const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    // host: "smtp-relay.brevo.com",
    // port: 587,
    // secure : false,
    // auth: {
    //   user: "835504001@smtp-brevo.com",
    //   pass: "2KmVZ0nGTYM1gFWB"
    // }
    service: 'gmail',
    auth: {
        user: 'abdelghaniberhouch2001@gmail.com', // استبدل ببريدك الإلكتروني
        pass: 'fcyx pjgr qkpl nvlh' // استبدل بكلمة مرورك
    }
  });

  const sendMail = async ({ to, subject, message }) => {
    if (!to) {
      console.error('Error: No recipient email provided.');
      return;
    }

    
    const mailOptions = {
        from: 'abdelghaniberhouch2001@gmail.com',
        to,
        subject,
        text: message,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      console.log('Message ID:', info.messageId);
      console.log(mailOptions)
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  module.exports = {sendMail};

