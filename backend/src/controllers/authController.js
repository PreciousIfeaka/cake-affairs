const { getPool } = require('../db/migrations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return res.status(500).json({ error: 'ADMIN_EMAIL is not configured on the server.' });
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const db = getPool();
    // Check if the password hash has been saved in the settings table
    const result = await db.query("SELECT value FROM settings WHERE key = 'admin_password_hash'");
    const storedHashRecord = result.rows[0];

    if (!storedHashRecord) {
      // First login! Store the password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await db.query(
        "INSERT INTO settings (key, value) VALUES ('admin_password_hash', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [hash]
      );
    } else {
      // Subsequent logins: verify password
      const isCorrect = await bcrypt.compare(password, storedHashRecord.value);
      if (!isCorrect) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    const token = jwt.sign(
      { email: email.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('admin_key', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ token, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
}

async function logout(req, res) {
  res.clearCookie('admin_key', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true });
}

async function forgotPassword(req, res) {
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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const db = getPool();
    await db.query(`
      INSERT INTO otps (email, code, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at
    `, [email.toLowerCase(), code, expiresAt]);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`\n======================================================\n[DEV MODE] SMTP not configured. Forgot Password OTP for ${email} is: ${code}\n======================================================\n`);
    } else {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Cake Affairs" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Cake Affairs Admin Password Reset OTP',
        text: `Your password reset verification code is: ${code}\nThis code is valid for 10 minutes.`,
        html: `<p>Your password reset verification code is: <strong>${code}</strong></p><p>This code is valid for 10 minutes.</p>`,
      });
    }

    res.json({ message: 'Verification code sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send verification code.' });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;
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

    // Hash and store the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await db.query(
      "INSERT INTO settings (key, value) VALUES ('admin_password_hash', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [hash]
    );

    // Issue JWT cookie so the user is logged in
    const token = jwt.sign(
      { email: email.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('admin_key', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ token, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminEmail = req.admin.email; // From adminAuth middleware

    const db = getPool();
    // Retrieve stored password hash
    const result = await db.query("SELECT value FROM settings WHERE key = 'admin_password_hash'");
    const storedHashRecord = result.rows[0];

    if (!storedHashRecord) {
      return res.status(400).json({ error: 'Admin password is not registered yet.' });
    }

    // Verify current password
    const isCorrect = await bcrypt.compare(currentPassword, storedHashRecord.value);
    if (!isCorrect) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    // Hash and store new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await db.query(
      "INSERT INTO settings (key, value) VALUES ('admin_password_hash', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [hash]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
}

module.exports = { login, logout, forgotPassword, resetPassword, changePassword };
