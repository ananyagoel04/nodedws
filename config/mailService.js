const nodemailer = require('nodemailer');

// Load environment variables from .env
require('dotenv').config();

// Set up the transport with Zoho's SMTP server details
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587, 
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = transporter;
