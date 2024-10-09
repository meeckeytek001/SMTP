const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const app = express();
const PORT = 3000;

dotenv.config()
// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint to send email
app.post('/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;

    // AWS SMTP settings
    const transporter = nodemailer.createTransport({
        host: process.env.smtp_host, // Replace with your AWS SES region
        port: 587, // TLS port
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.smtp_username, // Your SMTP username
            pass: process.env.smtp_password    // Your SMTP password
        }
    });

    // Email content
    const mailOptions = {
        from,        // Sender address
        to,          // List of receivers from request body
        subject,     // Subject from request body
        text,        // Plain text from request body
        html         // HTML body from request body
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: 'Email sent successfully!',
            messageId: info.messageId,
            previewURL: nodemailer.getTestMessageUrl(info)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error sending email',
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
