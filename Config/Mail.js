const dotenv=require('dotenv').config();
const nodemailer=require('nodemailer');
const sendResetEmail = (email, resetToken) => {
    const transporter = nodemailer.createTransport({
      service: 'smtp@gmail.com', // Gmail SMTP service
      auth: {
        user: 'rahul658541@gmail.com', // Replace with your email
        pass: process.env.MAIL_PASS,  // Replace with your email password or app password
      },
      tls: { 
        rejectUnauthorized: false  // Needed for SSL/TLS
      }
    });
  
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
    const mailOptions = {
      from: 'rahul658541@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset.\n\n Click the following link to reset your password: ${resetUrl}`,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Error sending email: ', err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
  module.exports={sendResetEmail};