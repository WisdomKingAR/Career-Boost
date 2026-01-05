const nodemailer = require('nodemailer');

// For development, log OTP. If SMTP creds exist, send real email.
const sendOTPEmail = async (email, otp) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const service = process.env.EMAIL_SERVICE;
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined;
    const secure = String(process.env.EMAIL_SECURE || '').toLowerCase() === 'true';
    const from = process.env.EMAIL_FROM || user || 'no-reply@careerboost.local';

    try {
        let transporter;
        if (host) {
            transporter = nodemailer.createTransport({
                host,
                port: port || 587,
                secure: !!secure,
                auth: (user && pass) ? { user, pass } : undefined,
            });
        } else if (user && pass) {
            transporter = nodemailer.createTransport({
                service: service || 'gmail',
                auth: { user, pass },
            });
        }

        if (transporter) {
            await transporter.sendMail({
                from,
                to: email,
                subject: 'CareerBoost Email Verification - OTP',
                text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
            });
            return true;
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }

    console.log(`\n-----------------------------------------`);
    console.log(`📧 EMAIL TO: ${email}`);
    console.log(`🔢 YOUR OTP: ${otp}`);
    console.log(`-----------------------------------------\n`);
    return true;
};

module.exports = { sendOTPEmail };
