require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { runMigrations } = require('./src/db/migrations');

const app = express();
const PORT = process.env.PORT || 3001;

// HTTP Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: false,
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});
app.use('/api/cloudinary', uploadLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Run DB migrations on startup
runMigrations()
  .then(() => {
    console.log('PostgreSQL database migrations complete.');
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Cake Affairs API running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('PostgreSQL migration failed:', err);
  });

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/settings', require('./src/routes/settings'));
app.use('/api/cloudinary', require('./src/routes/cloudinary'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Multer error handler
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 15MB.' });
  }
  if (err.message === 'Only image and video files are allowed') {
    return res.status(415).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
