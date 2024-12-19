const nodemailer = require('nodemailer');

// Load environment variables from .env
require('dotenv').config();

// Set up the transport with credentials from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

module.exports = transporter;
