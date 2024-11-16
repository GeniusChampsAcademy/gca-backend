const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();

// Enable CORS for all origins
app.use(cors({ origin: '*' }));

// Middleware
app.use(express.json());

// Contact form route
app.post('/api/contact', async (req, res) => {
  const { name, contact, email, service, message } = req.body;

  console.log('Preparing to send email...');

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  let mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'geniuschampsacademy@gmail.com',
    subject: 'New Contact Us Form Submission',
    text: `Name: ${name}\nContact Number: ${contact}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Export app for Vercel
module.exports = app;
