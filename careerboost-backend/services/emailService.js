const nodemailer = require('nodemailer');

// For development, log OTP. If SMTP creds exist, send real email.
const sendOTPEmail = async (email, otp) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (user && pass) {
        try {
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: { user, pass }
            });

            const mailOptions = {
                from: user,
                to: email,
                subject: 'CareerBoost Email Verification - OTP',
                text: `Your verification code is: ${otp}. It will expire in 10 minutes.`
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            // Fallback to console log
        }
    }

    console.log(`\n-----------------------------------------`);
    console.log(`📧 EMAIL TO: ${email}`);
    console.log(`🔢 YOUR OTP: ${otp}`);
    console.log(`-----------------------------------------\n`);
    return true;
};

module.exports = { sendOTPEmail };
