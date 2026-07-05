const { getPool } = require('../db/migrations');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

async function requestOTP(req, res) {
  try {
    const { email } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return res.status(500).json({ error: 'ADMIN_EMAIL is not configured on the server.' });
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const db = getPool();
    await db.query(`
      INSERT INTO otps (email, code, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at
    `, [email.toLowerCase(), code, expiresAt]);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`\n======================================================\n[DEV MODE] SMTP not configured. OTP for ${email} is: ${code}\n======================================================\n`);
    } else {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Cake Affairs" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Cake Affairs Admin Verification Code',
        text: `Your admin verification code is: ${code}\nThis code is valid for 10 minutes.`,
        html: `<p>Your admin verification code is: <strong>${code}</strong></p><p>This code is valid for 10 minutes.</p>`,
      });
    }

    res.json({ message: 'Verification code sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send verification code.' });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, code } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const db = getPool();
    const result = await db.query('SELECT * FROM otps WHERE email = $1', [email.toLowerCase()]);
    const otpRecord = result.rows[0];

    if (!otpRecord) {
      return res.status(400).json({ error: 'Verification code has expired or is invalid.' });
    }

    const expiresAt = new Date(otpRecord.expires_at);
    if (Date.now() > expiresAt.getTime()) {
      await db.query('DELETE FROM otps WHERE email = $1', [email.toLowerCase()]);
      return res.status(400).json({ error: 'Verification code has expired.' });
    }

    if (otpRecord.code !== code) {
      return res.status(400).json({ error: 'Verification code is invalid.' });
    }

    await db.query('DELETE FROM otps WHERE email = $1', [email.toLowerCase()]);

    const token = jwt.sign(
      { email: email.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed.' });
  }
}

module.exports = { requestOTP, verifyOTP };
