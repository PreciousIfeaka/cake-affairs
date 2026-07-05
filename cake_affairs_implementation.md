# Cake Affairs by E — Full Implementation Specification

## Project Overview

**"Cake Affairs by E"** is a full-stack web application for an artisanal bakery. It consists of:
- A **public-facing Catalogue** where customers browse cakes, filter them, and click "Order Now" to contact via WhatsApp.
- An **Admin Dashboard** where the bakery owner uploads new products (name, price, category, image/video, description).

**Stack:** React (Vite, pure JS — no TypeScript), Node.js (Express), SQLite (via `better-sqlite3`), Cloudinary for media storage.

---

## Design System — "Artisanal Hearth"

Derived from Stitch project `11535546356759344013`. Implement faithfully.

### Fonts (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

### Color Palette (CSS Variables — define in `index.css`)
```css
:root {
  --color-primary: #361f1a;
  --color-on-primary: #ffffff;
  --color-primary-container: #4e342e;
  --color-on-primary-container: #c19c94;
  --color-primary-fixed: #ffdad2;
  --color-primary-fixed-dim: #e5beb5;
  --color-on-primary-fixed: #2b1611;
  --color-on-primary-fixed-variant: #5c403a;
  --color-secondary: #655d5a;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #ece0dc;
  --color-on-secondary-container: #6b6360;
  --color-secondary-fixed: #ece0dc;
  --color-secondary-fixed-dim: #cfc4c0;
  --color-on-secondary-fixed: #201a18;
  --color-on-secondary-fixed-variant: #4c4542;
  --color-tertiary: #31211a;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #49362f;
  --color-on-tertiary-container: #b99f95;
  --color-tertiary-fixed: #fadcd2;
  --color-tertiary-fixed-dim: #ddc1b7;
  --color-on-tertiary-fixed: #271812;
  --color-on-tertiary-fixed-variant: #56423b;
  --color-background: #fbf9f7;
  --color-on-background: #1b1c1b;
  --color-surface: #fbf9f7;
  --color-on-surface: #1b1c1b;
  --color-surface-variant: #e4e2e0;
  --color-on-surface-variant: #504442;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f5f3f1;
  --color-surface-container: #efedec;
  --color-surface-container-high: #eae8e6;
  --color-surface-container-highest: #e4e2e0;
  --color-surface-dim: #dbdad8;
  --color-surface-bright: #fbf9f7;
  --color-inverse-surface: #30302f;
  --color-inverse-on-surface: #f2f0ee;
  --color-inverse-primary: #e5beb5;
  --color-outline: #827471;
  --color-outline-variant: #d4c3bf;
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
  --color-surface-tint: #755750;

  /* Shadows — Cocoa-tinted, not pure black */
  --shadow-sm: 0 4px 12px rgba(54, 31, 26, 0.05);
  --shadow-md: 0 8px 24px rgba(54, 31, 26, 0.08);
  --shadow-lg: 0 12px 32px rgba(54, 31, 26, 0.12);

  /* Spacing */
  --spacing-base: 8px;
  --spacing-gutter: 24px;
  --spacing-margin-mobile: 20px;
  --spacing-margin-desktop: 64px;
  --spacing-section-gap: 80px;
  --container-max: 1280px;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-default: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
}
```

### Typography Scale
| Token | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| `display-lg` | Libre Caslon Text | 48px | 700 | 56px |
| `display-lg-mobile` | Libre Caslon Text | 36px | 700 | 44px |
| `headline-md` | Libre Caslon Text | 32px | 400 | 40px |
| `headline-sm` | Libre Caslon Text | 24px | 400 | 32px |
| `body-lg` | Plus Jakarta Sans | 18px | 400 | 28px |
| `body-md` | Plus Jakarta Sans | 16px | 400 | 24px |
| `label-md` | Plus Jakarta Sans | 14px | 600 | 20px |
| `label-sm` | Plus Jakarta Sans | 12px | 500 | 16px |

---

## Directory Structure

```
cake-affairs/
├── frontend/                    # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── BottomNav.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   ├── catalogue/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── CategoryScroller.jsx
│   │   │   │   ├── FilterBar.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   └── ProductCard.jsx
│   │   │   └── admin/
│   │   │       ├── AddProductForm.jsx
│   │   │       ├── ImageUploadZone.jsx
│   │   │       ├── StatsPanel.jsx
│   │   │       └── ProductListingGrid.jsx
│   │   ├── pages/
│   │   │   ├── CataloguePage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios wrapper for backend calls
│   │   ├── hooks/
│   │   │   ├── useProducts.js
│   │   │   └── useFilter.js
│   │   ├── utils/
│   │   │   └── compressImage.js    # Browser-side lossless compression
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/                     # Node.js + Express
    ├── src/
    │   ├── config/
    │   │   ├── database.js          # SQLite init & connection
    │   │   └── cloudinary.js        # Cloudinary SDK config
    │   ├── middleware/
    │   │   ├── auth.js              # Admin API key auth
    │   │   ├── upload.js            # Multer config (memory storage)
    │   │   └── validate.js          # Request validation helpers
    │   ├── routes/
    │   │   ├── products.js          # /api/products CRUD
    │   │   └── settings.js          # /api/settings (WhatsApp number)
    │   ├── controllers/
    │   │   ├── productController.js
    │   │   └── settingsController.js
    │   └── db/
    │       └── migrations.js        # Create tables if not exist
    ├── data/
    │   └── cake_affairs.db          # SQLite database file (gitignored)
    ├── index.js                     # Express app entry point
    ├── .env.example                 # Template (never commit .env)
    └── package.json
```

---

## Backend — Node.js / Express

### 1. `package.json` dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^9.4.3",
    "cloudinary": "^2.2.0",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.4.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.2.0",
    "sharp": "^0.33.3",
    "nanoid": "^3.3.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

### 2. `.env.example`
```
PORT=3001
ADMIN_API_KEY=change_this_to_a_strong_random_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SQLite database path (relative to project root)
DB_PATH=./data/cake_affairs.db
```

### 3. Database Schema — `src/db/migrations.js`

```js
// src/db/migrations.js
const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDb() {
  if (!db) {
    const dbPath = process.env.DB_PATH || './data/cake_affairs.db';
    db = new Database(path.resolve(dbPath), {
      // Enable WAL mode for better concurrency (important if deployed)
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      price       REAL NOT NULL CHECK(price >= 0),
      category    TEXT NOT NULL,
      image_url   TEXT,
      video_url   TEXT,
      public_id   TEXT,         -- Cloudinary public_id for deletion
      badge       TEXT,         -- e.g. "Best Seller", "Vegan", "Low Stock"
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Seed default WhatsApp number (can be updated via admin)
    INSERT OR IGNORE INTO settings (key, value)
    VALUES ('whatsapp_number', '2348000000000');
  `);
}

module.exports = { getDb, runMigrations };
```

> **Security note for Vercel deployment:** SQLite writes to disk, but Vercel functions are ephemeral — the filesystem is read-only (except `/tmp`). You have two options:
> 1. **Recommended:** Migrate to [Turso](https://turso.tech) (libSQL — SQLite-compatible, serverless-friendly) using the `@libsql/client` driver. The schema and queries are nearly identical.
> 2. **Alternative:** Use [Neon PostgreSQL](https://neon.tech) (free tier) with `pg` driver and adapt the SQL.
> 3. **Simplest (for small traffic):** Deploy backend to [Railway](https://railway.app) or [Render](https://render.com) instead of Vercel — they support persistent disks and SQLite works without changes.

### 4. `src/config/cloudinary.js`
```js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;
```

### 5. `src/middleware/upload.js`
```js
const multer = require('multer');

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB hard limit

const upload = multer({
  storage: multer.memoryStorage(),  // keep in RAM for piping to Cloudinary
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  },
});

module.exports = upload;
```

### 6. `src/middleware/auth.js`
```js
// Simple API key authentication for admin routes
module.exports = function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

### 7. `src/controllers/productController.js`

```js
const { getDb } = require('../db/migrations');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

// --- Helper: Compress image buffer losslessly before upload ---
async function compressImageBuffer(buffer, mimetype) {
  if (!mimetype.startsWith('image/')) return buffer; // skip video
  
  // Use sharp for lossless/near-lossless compression
  // PNG → lossless PNG with optimised compression
  // JPEG/WebP → convert to WebP lossless (still high quality, smaller)
  // This ensures images are clear on the catalogue
  const sharpInstance = sharp(buffer);
  const metadata = await sharpInstance.metadata();

  if (mimetype === 'image/png') {
    return sharpInstance
      .png({ compressionLevel: 9, adaptiveFiltering: true, progressive: true })
      .toBuffer();
  }

  // For JPEG and others, use WebP lossless for best quality-to-size ratio
  // Cap width at 2400px to avoid massive uploads while maintaining clarity
  const maxWidth = 2400;
  const resized = metadata.width > maxWidth
    ? sharpInstance.resize({ width: maxWidth, withoutEnlargement: true })
    : sharpInstance;

  return resized
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
}

// GET /api/products
async function listProducts(req, res) {
  try {
    const db = getDb();
    const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const products = db.prepare(query).all(...params);

    // Count total for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = params.slice(0, -2); // remove LIMIT/OFFSET params
    if (category) countQuery += ' AND LOWER(category) = LOWER(?)';
    if (minPrice)  countQuery += ' AND price >= ?';
    if (maxPrice)  countQuery += ' AND price <= ?';
    if (search)    countQuery += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list products' });
  }
}

// GET /api/products/categories  — distinct categories list
async function listCategories(req, res) {
  try {
    const db = getDb();
    const rows = db.prepare(
      'SELECT DISTINCT category FROM products ORDER BY category ASC'
    ).all();
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list categories' });
  }
}

// GET /api/products/:id
async function getProduct(req, res) {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get product' });
  }
}

// POST /api/products  (admin only)
async function createProduct(req, res) {
  try {
    const { name, description, price, category, badge } = req.body;

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price and category are required' });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number' });
    }

    let image_url = null;
    let video_url = null;
    let public_id = null;

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video/');
      const isImage = req.file.mimetype.startsWith('image/');

      let uploadBuffer = req.file.buffer;

      // Image compression (lossless) before upload
      if (isImage) {
        try {
          uploadBuffer = await compressImageBuffer(req.file.buffer, req.file.mimetype);
        } catch (compressErr) {
          console.warn('Compression failed, uploading original:', compressErr.message);
          uploadBuffer = req.file.buffer; // fallback to original
        }
      }

      // Upload to Cloudinary via stream
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cake-affairs',
            resource_type: isVideo ? 'video' : 'image',
            // For images already compressed, use lossless Cloudinary setting
            quality: isImage ? 'auto:best' : undefined,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(uploadBuffer);
      });

      public_id = uploadResult.public_id;
      if (isImage) image_url = uploadResult.secure_url;
      if (isVideo) video_url = uploadResult.secure_url;
    }

    const id = nanoid(10);
    const db = getDb();

    db.prepare(`
      INSERT INTO products (id, name, description, price, category, image_url, video_url, public_id, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, description || null, parseFloat(price), category, image_url, video_url, public_id, badge || null);

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

// PUT /api/products/:id  (admin only)
async function updateProduct(req, res) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, category, badge } = req.body;

    let image_url = existing.image_url;
    let video_url = existing.video_url;
    let public_id = existing.public_id;

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video/');
      const isImage = req.file.mimetype.startsWith('image/');
      let uploadBuffer = req.file.buffer;

      if (isImage) {
        try {
          uploadBuffer = await compressImageBuffer(req.file.buffer, req.file.mimetype);
        } catch (e) { /* use original */ }
      }

      // Delete old Cloudinary asset if exists
      if (existing.public_id) {
        await cloudinary.uploader.destroy(existing.public_id, {
          resource_type: existing.video_url ? 'video' : 'image',
        }).catch(console.warn);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'cake-affairs', resource_type: isVideo ? 'video' : 'image', quality: isImage ? 'auto:best' : undefined },
          (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(uploadBuffer);
      });

      public_id = uploadResult.public_id;
      image_url = isImage ? uploadResult.secure_url : null;
      video_url = isVideo ? uploadResult.secure_url : null;
    }

    db.prepare(`
      UPDATE products
      SET name=?, description=?, price=?, category=?, image_url=?, video_url=?, public_id=?, badge=?,
          updated_at=datetime('now')
      WHERE id=?
    `).run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      price ? parseFloat(price) : existing.price,
      category || existing.category,
      image_url, video_url, public_id,
      badge !== undefined ? badge : existing.badge,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// DELETE /api/products/:id  (admin only)
async function deleteProduct(req, res) {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete from Cloudinary
    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id, {
        resource_type: product.video_url ? 'video' : 'image',
      }).catch(console.warn);
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = { listProducts, listCategories, getProduct, createProduct, updateProduct, deleteProduct };
```

### 8. `src/controllers/settingsController.js`
```js
const { getDb } = require('../db/migrations');

function getSetting(req, res) {
  const db = getDb();
  const { key } = req.params;
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  if (!row) return res.status(404).json({ error: 'Setting not found' });
  res.json({ key, value: row.value });
}

function updateSetting(req, res) {
  const db = getDb();
  const { key } = req.params;
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: 'value is required' });
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
    .run(key, value);
  res.json({ key, value });
}

module.exports = { getSetting, updateSetting };
```

### 9. `src/routes/products.js`
```js
const router = require('express').Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/productController');

// Public routes
router.get('/',             ctrl.listProducts);
router.get('/categories',   ctrl.listCategories);
router.get('/:id',          ctrl.getProduct);

// Admin routes (require API key)
router.post('/',            auth, upload.single('media'), ctrl.createProduct);
router.put('/:id',          auth, upload.single('media'), ctrl.updateProduct);
router.delete('/:id',       auth,                         ctrl.deleteProduct);

module.exports = router;
```

### 10. `src/routes/settings.js`
```js
const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/settingsController');

router.get('/:key',       ctrl.getSetting);
router.put('/:key', auth, ctrl.updateSetting);

module.exports = router;
```

### 11. `index.js` — Express entry point
```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { runMigrations } = require('./src/db/migrations');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: false,
}));

// Rate limiting — protect the upload endpoint
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for upload
});
app.use('/api/products', uploadLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Run DB migrations on startup
runMigrations();

// Routes
app.use('/api/products', require('./src/routes/products'));
app.use('/api/settings', require('./src/routes/settings'));

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

app.listen(PORT, () => {
  console.log(`Cake Affairs API running on http://localhost:${PORT}`);
});
```

---

## Frontend — React / Vite

### 1. `package.json` dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  }
}
```

### 2. `vite.config.js`
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### 3. `src/index.css` — Design System Styles
```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

/* --- PASTE ALL CSS VARIABLES FROM DESIGN SYSTEM SECTION ABOVE --- */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { font-size: 16px; -webkit-tap-highlight-color: transparent; }

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  background-color: var(--color-background);
  color: var(--color-on-surface);
  overflow-x: hidden;
}

/* Typography utility classes */
.display-lg { font-family: 'Libre Caslon Text', serif; font-size: 48px; font-weight: 700; line-height: 56px; letter-spacing: -0.02em; }
.display-lg-mobile { font-family: 'Libre Caslon Text', serif; font-size: 36px; font-weight: 700; line-height: 44px; letter-spacing: -0.01em; }
.headline-md { font-family: 'Libre Caslon Text', serif; font-size: 32px; font-weight: 400; line-height: 40px; }
.headline-sm { font-family: 'Libre Caslon Text', serif; font-size: 24px; font-weight: 400; line-height: 32px; }
.body-lg { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 400; line-height: 28px; }
.body-md { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; }
.label-md { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; line-height: 20px; letter-spacing: 0.05em; }
.label-sm { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 500; line-height: 16px; }

/* Material Icons */
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Shadow utilities */
.shadow-sm  { box-shadow: var(--shadow-sm); }
.shadow-md  { box-shadow: var(--shadow-md); }
.shadow-lg  { box-shadow: var(--shadow-lg); }

/* Scrollbar hiding utility */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Button base styles */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: 12px 24px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.15s ease, transform 0.15s ease;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:active { transform: scale(0.96); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  background-color: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.btn-secondary:hover { background-color: var(--color-outline-variant); }

/* Input base */
.input-field {
  width: 100%;
  background-color: var(--color-secondary-fixed);
  border: none;
  border-radius: var(--radius-lg);
  padding: 12px;
  color: var(--color-on-surface);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.2s ease;
}
.input-field::placeholder { color: var(--color-outline); }
.input-field:focus { box-shadow: 0 0 0 2px var(--color-primary); }

/* Card */
.product-card {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(212, 195, 191, 0.1);
  transition: transform 0.2s ease;
}
.product-card:hover { transform: translateY(-4px); }

/* Container */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--spacing-margin-mobile);
}
@media (min-width: 768px) {
  .container { padding-inline: var(--spacing-margin-desktop); }
}
```

### 4. `src/services/api.js`
```js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Attach admin key for protected routes
export function setAdminKey(key) {
  api.defaults.headers.common['x-admin-key'] = key;
}

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getCategories = () => api.get('/products/categories');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (formData) => api.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProduct = (id, formData) => api.put(`/products/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Settings
export const getSetting = (key) => api.get(`/settings/${key}`);
export const updateSetting = (key, value) => api.put(`/settings/${key}`, { value });

export default api;
```

### 5. `src/utils/compressImage.js` — Browser-side compression
```js
/**
 * Losslessly compress an image File in the browser using the Canvas API.
 * - PNG: re-encoded at full quality (lossless)
 * - JPEG/WebP: re-encoded at 98% quality (near-lossless, much smaller)
 * - Caps maximum dimension at 2400px to prevent absurdly large uploads
 *   while keeping the image sharp and detailed on the catalogue.
 *
 * @param {File} file - the original image File
 * @returns {Promise<File>} compressed File
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file); // not an image, return unchanged
      return;
    }

    const MAX_DIMENSION = 2400;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Maintain aspect ratio
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const isPng = file.type === 'image/png';
      // PNG → keep as PNG lossless; others → WebP at near-lossless quality
      const outputMime = isPng ? 'image/png' : 'image/webp';
      const quality = isPng ? 1.0 : 0.98; // 0.98 = near-lossless for WebP

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; } // fallback if conversion fails
          const compressed = new File([blob], file.name.replace(/\.\w+$/, isPng ? '.png' : '.webp'), {
            type: outputMime,
            lastModified: Date.now(),
          });
          // Only use compressed if it's actually smaller
          resolve(compressed.size < file.size ? compressed : file);
        },
        outputMime,
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
  });
}
```

### 6. `src/hooks/useProducts.js`
```js
import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(filters),
        getCategories(),
      ]);
      setProducts(productsRes.data.products);
      setPagination(productsRes.data.pagination);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, categories, loading, error, pagination, refetch: fetchProducts };
}
```

### 7. `src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CataloguePage from './pages/CataloguePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<CataloguePage />} />
        <Route path="/admin"  element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 8. Common Components

#### `src/components/common/Header.jsx`
```jsx
import { Link } from 'react-router-dom';

export default function Header({ isAdmin = false }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 64, backgroundColor: 'var(--color-background)',
      boxShadow: '0 1px 4px rgba(54,31,26,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 var(--spacing-margin-mobile)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="material-symbols-outlined" style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>menu</button>
        {isAdmin && (
          <nav style={{ display: 'flex', gap: 24 }}>
            <a href="#" className="label-md" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Dashboard</a>
            <a href="#" className="label-md" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Inventory</a>
          </nav>
        )}
      </div>
      <Link to={isAdmin ? '/' : '/admin'} style={{ textDecoration: 'none' }}>
        <span className="headline-md" style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>
          Cake Affairs by E
        </span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {!isAdmin ? (
          <button className="material-symbols-outlined" style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>shopping_bag</button>
        ) : (
          <Link to="/" className="label-md btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px' }}>View Catalogue</Link>
        )}
      </div>
    </header>
  );
}
```

---

### 9. Catalogue Page Components

#### `src/components/catalogue/FilterBar.jsx`
```jsx
import { useState } from 'react';

export default function FilterBar({ categories, filters, onFilterChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Search input */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-outline)', fontSize: 20, pointerEvents: 'none'
          }}>search</span>
          <input
            className="input-field"
            style={{ paddingLeft: 44 }}
            type="text"
            placeholder="Search cakes..."
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
          />
        </div>
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
          onClick={() => setOpen(!open)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>tune</span>
          Filters
        </button>
      </div>

      {/* Expandable filter panel */}
      {open && (
        <div style={{
          background: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 16,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Category filter */}
          <div>
            <label className="label-md" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>
              Category
            </label>
            <select
              className="input-field"
              value={filters.category || ''}
              onChange={e => onFilterChange({ category: e.target.value || undefined })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="label-md" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>
              Min Price ($)
            </label>
            <input
              className="input-field"
              type="number" min="0"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={e => onFilterChange({ minPrice: e.target.value || undefined })}
            />
          </div>
          <div>
            <label className="label-md" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>
              Max Price ($)
            </label>
            <input
              className="input-field"
              type="number" min="0"
              placeholder="Any"
              value={filters.maxPrice || ''}
              onChange={e => onFilterChange({ maxPrice: e.target.value || undefined })}
            />
          </div>

          {/* Clear filters */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => onFilterChange({ category: undefined, minPrice: undefined, maxPrice: undefined, search: undefined })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Active category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
        <button
          onClick={() => onFilterChange({ category: undefined })}
          style={{
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            backgroundColor: !filters.category ? 'var(--color-primary)' : 'var(--color-secondary-container)',
            color: !filters.category ? 'var(--color-on-primary)' : 'var(--color-on-secondary-container)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onFilterChange({ category: cat })}
            style={{
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              backgroundColor: filters.category === cat ? 'var(--color-primary)' : 'var(--color-secondary-container)',
              color: filters.category === cat ? 'var(--color-on-primary)' : 'var(--color-on-secondary-container)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### `src/components/catalogue/ProductCard.jsx`
```jsx
/**
 * @param {object} props
 * @param {object} props.product - product data
 * @param {string} props.whatsappNumber - e.g. "2348012345678"
 */
export default function ProductCard({ product, whatsappNumber }) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order "${product.name}" (₦${product.price}). Please let me know availability.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image / Video */}
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
        {product.video_url ? (
          <video
            src={product.video_url}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay muted loop playsInline
          />
        ) : product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', backgroundColor: 'var(--color-surface-container)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>cake</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}>
            <span className="label-sm" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              {product.badge.toUpperCase()}
            </span>
          </div>
        )}

        {/* Category chip */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          backgroundColor: 'var(--color-primary-container)',
          padding: '3px 10px', borderRadius: 'var(--radius-full)',
        }}>
          <span className="label-sm" style={{ color: 'var(--color-on-primary-container)' }}>{product.category}</span>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h4 className="headline-sm" style={{ fontSize: 18, color: 'var(--color-primary)', lineHeight: 1.3 }}>
          {product.name}
        </h4>
        {product.description && (
          <p className="label-sm" style={{ color: 'var(--color-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 }}>
          <span className="label-md" style={{ color: 'var(--color-primary)', fontSize: 16, fontWeight: 700 }}>
            ₦{Number(product.price).toLocaleString()}
          </span>
          {/* WhatsApp Order Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: 12, gap: 6, textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
            Order Now
          </a>
        </div>
      </div>
    </div>
  );
}
```

#### `src/pages/CataloguePage.jsx`
```jsx
import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import FilterBar from '../components/catalogue/FilterBar';
import ProductCard from '../components/catalogue/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { getSetting } from '../services/api';

export default function CataloguePage() {
  const [filters, setFilters] = useState({});
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { products, categories, loading, error, pagination } = useProducts(filters);

  useEffect(() => {
    getSetting('whatsapp_number')
      .then(res => setWhatsappNumber(res.data.value))
      .catch(() => {});
  }, []);

  function handleFilterChange(newFilters) {
    setFilters(prev => {
      const merged = { ...prev, ...newFilters };
      // Remove undefined keys
      Object.keys(merged).forEach(k => merged[k] === undefined && delete merged[k]);
      return merged;
    });
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 80 }}>

        {/* Hero Section */}
        <section style={{ padding: '0 var(--spacing-margin-mobile)', marginTop: 8 }}>
          <div style={{
            position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            aspectRatio: '16 / 9', boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(54,31,26,0) 0%, rgba(54,31,26,0.55) 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: 32, textAlign: 'center',
              backgroundColor: 'var(--color-primary-container)',
            }}>
              <h2 className="display-lg-mobile" style={{ color: 'white', marginBottom: 8 }}>Cakes Gallery</h2>
              <p className="body-md" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 24, maxWidth: 320 }}>
                Make your choice of the best cakes you want.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Order Now
              </a>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section style={{ padding: '24px var(--spacing-margin-mobile) 0' }}>
          <FilterBar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </section>

        {/* Product Grid */}
        <section style={{ padding: '0 var(--spacing-margin-mobile)', marginTop: 8 }}>
          <h3 className="headline-sm" style={{ color: 'var(--color-primary)', marginBottom: 20 }}>
            {Object.keys(filters).length > 0 ? 'Search Results' : 'Daily Selection'}
          </h3>

          {loading && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>refresh</span>
              <p className="body-md" style={{ marginTop: 8 }}>Loading delicious cakes...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-error)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40 }}>error</span>
              <p className="body-md" style={{ marginTop: 8 }}>{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>cake</span>
              <p className="body-md" style={{ marginTop: 8 }}>No cakes found. Try a different filter.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 'var(--spacing-gutter)',
            }}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand CTA */}
        <section style={{ padding: '32px var(--spacing-margin-mobile) 80px' }}>
          <div style={{
            backgroundColor: 'var(--color-primary-container)',
            borderRadius: 'var(--radius-xl)',
            padding: 32,
            textAlign: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-primary-fixed-dim)', display: 'block', marginBottom: 16 }}>bakery_dining</span>
            <h3 className="headline-sm" style={{ color: 'white', marginBottom: 8 }}>Baked with Love</h3>
            <p className="body-md" style={{ color: 'var(--color-on-primary-container)', marginBottom: 24 }}>
              Reach out via WhatsApp for custom orders, seasonal specials, and more.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Make Order
            </a>
          </div>
        </section>

      </main>
    </>
  );
}
```

---

### 10. Admin Page Components

#### `src/components/admin/ImageUploadZone.jsx`
```jsx
import { useState, useRef } from 'react';
import { compressImage } from '../../utils/compressImage';

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

export default function ImageUploadZone({ onFileReady }) {
  const [preview, setPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleFile(file) {
    setError('');
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large. Maximum size is 15MB.');
      return;
    }

    const fileIsVideo = file.type.startsWith('video/');
    const fileIsImage = file.type.startsWith('image/');
    if (!fileIsImage && !fileIsVideo) {
      setError('Only image or video files are allowed.');
      return;
    }

    let processedFile = file;
    if (fileIsImage) {
      try {
        processedFile = await compressImage(file);
      } catch (e) {
        processedFile = file; // fallback
      }
    }

    setIsVideo(fileIsVideo);
    setPreview(URL.createObjectURL(processedFile));
    onFileReady(processedFile);
  }

  function handleInputChange(e) { handleFile(e.target.files[0]); }
  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function removeFile() {
    setPreview(null);
    setIsVideo(false);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    onFileReady(null);
  }

  return (
    <div>
      <label className="label-md" style={{ display: 'block', marginBottom: 12, color: 'var(--color-on-surface-variant)' }}>
        Product Photography / Video
      </label>
      <div
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-xl)',
          border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
          backgroundColor: isDragging ? 'var(--color-secondary-container)' : 'var(--color-surface-container-low)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: preview ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleInputChange} />

        {!preview ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-primary)', display: 'block', marginBottom: 8 }}>cloud_upload</span>
            <p className="label-md" style={{ color: 'var(--color-primary)' }}>Click to upload or drag and drop</p>
            <p className="label-sm" style={{ color: 'var(--color-secondary)', marginTop: 4 }}>Images or videos up to 15MB</p>
          </div>
        ) : isVideo ? (
          <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
        ) : (
          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {preview && (
          <button
            type="button" onClick={removeFile}
            style={{
              position: 'absolute', top: 8, right: 8,
              backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
              border: 'none', borderRadius: 'var(--radius-full)',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        )}
      </div>
      {error && (
        <p className="label-sm" style={{ color: 'var(--color-error)', marginTop: 8 }}>{error}</p>
      )}
    </div>
  );
}
```

#### `src/components/admin/AddProductForm.jsx`
```jsx
import { useState } from 'react';
import ImageUploadZone from './ImageUploadZone';
import { createProduct } from '../../services/api';

export default function AddProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', badge: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setErrorMsg('Name, price and category are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSubmitStatus(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v) data.append(k, v); });
      if (file) data.append('media', file);

      await createProduct(data);
      setSubmitStatus('success');
      setFormData({ name: '', price: '', category: '', description: '', badge: '' });
      setFile(null);
      setTimeout(() => { setSubmitStatus(null); onSuccess?.(); }, 2000);
    } catch (err) {
      setSubmitStatus('error');
      setErrorMsg(err.response?.data?.error || 'Failed to publish product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
      padding: 32,
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(212,195,191,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 className="headline-sm" style={{ color: 'var(--color-primary)' }}>Add New Cake</h2>
        <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)' }}>auto_awesome</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {/* Image Upload */}
          <ImageUploadZone onFileReady={setFile} />

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label-md" htmlFor="name" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Cake Name *</label>
              <input id="name" name="name" type="text" className="input-field" placeholder="e.g. Vanilla Bean Cloud" value={formData.name} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="label-md" htmlFor="price" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Price (₦) *</label>
                <input id="price" name="price" type="number" min="0" step="0.01" className="input-field" placeholder="45.00" value={formData.price} onChange={handleChange} required />
              </div>
              <div>
                {/* Category is a FREE TEXT input — not a dropdown */}
                <label className="label-md" htmlFor="category" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Category *</label>
                <input id="category" name="category" type="text" className="input-field" placeholder="e.g. Wedding, Vegan..." value={formData.category} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="label-md" htmlFor="badge" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Badge (optional)</label>
              <input id="badge" name="badge" type="text" className="input-field" placeholder="e.g. Best Seller, New, Vegan" value={formData.badge} onChange={handleChange} />
            </div>

            <div>
              <label className="label-md" htmlFor="description" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Description</label>
              <textarea id="description" name="description" className="input-field" placeholder="Describe the flavors, textures, and inspiration..." rows={4} style={{ resize: 'vertical' }} value={formData.description} onChange={handleChange} />
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="label-sm" style={{ color: 'var(--color-error)', marginTop: 16 }}>{errorMsg}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="submit" className="btn-primary" disabled={submitting} style={{
            backgroundColor: submitStatus === 'success' ? 'var(--color-tertiary-container)' : undefined,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, animation: submitting ? 'spin 1s linear infinite' : 'none' }}>
              {submitting ? 'refresh' : submitStatus === 'success' ? 'check' : 'add'}
            </span>
            {submitting ? 'Publishing...' : submitStatus === 'success' ? 'Published!' : 'Publish to Catalog'}
          </button>
        </div>
      </form>
    </section>
  );
}
```

#### `src/components/admin/ProductListingGrid.jsx`
```jsx
import { useState } from 'react';
import { deleteProduct } from '../../services/api';

export default function ProductListingGrid({ products, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove "${name}" from your collection?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      onRefresh();
    } catch (e) {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  }

  if (!products.length) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-secondary)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', display: 'block' }}>inventory_2</span>
        <p className="body-md" style={{ marginTop: 8 }}>No products yet. Add your first masterpiece above.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-gutter)' }}>
      {products.map(product => (
        <div key={product.id} className="product-card" style={{
          opacity: deletingId === product.id ? 0 : 1,
          transform: deletingId === product.id ? 'scale(0.9)' : 'none',
          transition: 'opacity 0.3s, transform 0.3s',
        }}>
          <div style={{ height: 224, overflow: 'hidden', position: 'relative' }}>
            {product.video_url ? (
              <video src={product.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay playsInline />
            ) : product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>cake</span>
              </div>
            )}
            {product.badge && (
              <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'var(--color-tertiary)', color: 'var(--color-on-tertiary)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                <span className="label-sm">{product.badge}</span>
              </div>
            )}
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)' }}>{product.name}</h3>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 15 }}>₦{Number(product.price).toLocaleString()}</span>
            </div>
            <p className="label-sm" style={{ color: 'var(--color-secondary)', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description || product.category}
            </p>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(212,195,191,0.2)' }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 12 }}>Edit</button>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-error)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add placeholder */}
      <button style={{
        border: '2px dashed var(--color-outline-variant)', borderRadius: 'var(--radius-xl)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 32, cursor: 'pointer', background: 'none',
        transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,224,220,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary)' }}>add</span>
        </div>
        <p className="label-md" style={{ color: 'var(--color-primary)' }}>New Masterpiece</p>
        <p className="label-sm" style={{ color: 'var(--color-secondary)', textAlign: 'center', marginTop: 4 }}>Add a new creation</p>
      </button>
    </div>
  );
}
```

#### `src/pages/AdminPage.jsx`
```jsx
import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import AddProductForm from '../components/admin/AddProductForm';
import ProductListingGrid from '../components/admin/ProductListingGrid';
import { useProducts } from '../hooks/useProducts';
import { setAdminKey, getSetting, updateSetting } from '../services/api';

export default function AdminPage() {
  const { products, loading, refetch } = useProducts({ limit: 50 });
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('admin_key') || '');
  const [keyInput, setKeyInput] = useState('');
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('admin_key'));
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [savingWa, setSavingWa] = useState(false);

  useEffect(() => {
    if (apiKey) setAdminKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    getSetting('whatsapp_number').then(r => setWhatsappNumber(r.data.value)).catch(() => {});
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    localStorage.setItem('admin_key', keyInput);
    setApiKey(keyInput);
    setAdminKey(keyInput);
    setAuthenticated(true);
  }

  async function saveWhatsapp(e) {
    e.preventDefault();
    setSavingWa(true);
    try {
      await updateSetting('whatsapp_number', whatsappNumber);
      alert('WhatsApp number updated!');
    } catch { alert('Failed to save. Check your admin key.'); }
    finally { setSavingWa(false); }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: 40, backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 className="headline-sm" style={{ color: 'var(--color-primary)', marginBottom: 8 }}>Admin Login</h1>
          <p className="body-md" style={{ color: 'var(--color-secondary)', marginBottom: 24 }}>Enter your admin API key to continue.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="password" className="input-field" placeholder="Admin API Key" value={keyInput} onChange={e => setKeyInput(e.target.value)} required />
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header isAdmin />
      <main style={{ paddingTop: 96, paddingBottom: 64, maxWidth: 'var(--container-max)', marginInline: 'auto', padding: '96px var(--spacing-margin-mobile) 64px' }}>

        {/* Header */}
        <section style={{ marginBottom: 'var(--spacing-section-gap)' }}>
          <h1 className="display-lg-mobile" style={{ color: 'var(--color-primary)', marginBottom: 12 }}>Bakery Management</h1>
          <p className="body-lg" style={{ color: 'var(--color-secondary)', maxWidth: 520 }}>
            Curate your display case. Add your latest artisanal creations and manage your inventory with precision.
          </p>
        </section>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-gutter)', alignItems: 'start' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <AddProductForm onSuccess={refetch} />
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gutter)' }}>
            {/* Stats */}
            <div style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="headline-sm" style={{ color: 'var(--color-primary-fixed-dim)', marginBottom: 16 }}>Stock Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Active Listings', value: products.length },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(92,64,58,0.3)', paddingBottom: 8 }}>
                    <span className="label-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Settings */}
            <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(212,195,191,0.3)' }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                WhatsApp Contact
              </h3>
              <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 16 }}>
                This number is used in all "Order Now" buttons on the catalogue.
              </p>
              <form onSubmit={saveWhatsapp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text" className="input-field"
                  placeholder="e.g. 2348012345678 (include country code, no +)"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={savingWa}>
                  {savingWa ? 'Saving...' : 'Save Number'}
                </button>
              </form>
            </div>

            {/* Pro tip */}
            <div style={{ backgroundColor: 'var(--color-surface-container-high)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(212,195,191,0.3)' }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
                Pro Tip
              </h3>
              <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', fontStyle: 'italic', lineHeight: 1.6 }}>
                "High-fidelity close-ups of cake textures (flaky crusts, airy crumbs) tend to increase conversions."
              </p>
            </div>
          </div>
        </div>

        {/* Current Listings */}
        <section style={{ marginTop: 'var(--spacing-section-gap)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 className="headline-md" style={{ color: 'var(--color-primary)' }}>Current Listings</h2>
              <p className="body-md" style={{ color: 'var(--color-secondary)' }}>Manage your active display case items.</p>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-secondary)' }}>refresh</span>
            </div>
          ) : (
            <ProductListingGrid products={products} onRefresh={refetch} />
          )}
        </section>

      </main>
    </>
  );
}
```

---

## Security Considerations for Vercel Deployment

> **TL;DR: SQLite does not work on Vercel serverless functions.** Vercel's function filesystem is ephemeral and read-only except for `/tmp`. You must migrate to a managed database.

### Option 1 — Turso (libSQL / SQLite-compatible) — **Recommended**
1. Sign up at [turso.tech](https://turso.tech) (free tier: 500 DBs, 9GB storage).
2. `npm install @libsql/client` instead of `better-sqlite3`.
3. Replace `Database` calls with `createClient({ url, authToken })`.
4. Queries are async (`await db.execute(sql, args)`).
5. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as Vercel environment variables.
6. **Schema stays the same.**

### Option 2 — Deploy Backend on Railway / Render
- Deploy the Express backend (with SQLite) as a container on Railway/Render, which supports persistent disks.
- Point the Vercel frontend's `VITE_API_BASE_URL` to the Railway/Render service URL.
- **Zero database migration required.** Works out of the box.

### General Security Checklist
| Item | Implementation |
|---|---|
| Admin authentication | `x-admin-key` header checked against `ADMIN_API_KEY` env var |
| Rate limiting | `express-rate-limit` on all API routes and stricter limit on uploads |
| Helmet | HTTP security headers via `helmet` |
| File type validation | Multer `fileFilter` + MIME type whitelist |
| File size limit | 15MB hard limit in Multer |
| CORS | Whitelist only the frontend URL via env var |
| Cloudinary | Store credentials only in backend env; frontend never touches Cloudinary directly |
| API key storage | Never commit `.env`; use Vercel environment variables dashboard |
| SQLite WAL mode | Enabled for safer concurrent writes |
| Input sanitisation | Parameterised `better-sqlite3` queries — immune to SQL injection |

---

## Setup Instructions

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env: ADMIN_API_KEY, CLOUDINARY_*, PORT, FRONTEND_URL
node index.js          # or: npm run dev (with nodemon)
```

### Frontend
```bash
cd frontend
npm install
# Create frontend/.env
# VITE_API_BASE_URL=http://localhost:3001  (only if not using Vite proxy)
npm run dev
```

### Access
| URL | Description |
|---|---|
| `http://localhost:5173/` | Catalogue (public) |
| `http://localhost:5173/admin` | Admin dashboard |
| `http://localhost:3001/api/products` | API |

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | ❌ | List products (supports `?category`, `?search`, `?minPrice`, `?maxPrice`, `?page`, `?limit`) |
| GET | `/api/products/categories` | ❌ | List distinct categories |
| GET | `/api/products/:id` | ❌ | Get single product |
| POST | `/api/products` | ✅ | Create product (multipart/form-data with optional `media` file) |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product + Cloudinary asset |
| GET | `/api/settings/:key` | ❌ | Get setting (e.g. `whatsapp_number`) |
| PUT | `/api/settings/:key` | ✅ | Update setting |

✅ = Requires `x-admin-key` header matching `ADMIN_API_KEY` env var.

---

## Image Compression Strategy

Two-stage lossless/near-lossless compression:

1. **Browser (before upload)** — `compressImage.js`:
   - Canvas API re-encodes the image.
   - PNG → PNG (lossless, CompressionLevel 9).
   - JPEG/WebP → WebP at 0.98 quality (near-lossless, ~40–60% smaller).
   - Caps maximum dimension at 2400px (preserves sharpness on all screen sizes).
   - Only uses the compressed file if it's actually smaller.

2. **Server (before Cloudinary upload)** — `sharp`:
   - Second pass with `sharp` to handle any edge cases the browser missed.
   - PNG → optimised PNG.
   - Others → WebP lossless.
   - Same 2400px max width cap.
   - Fallback to original if compression fails.

3. **Cloudinary** — `quality: 'auto:best'`:
   - Cloudinary's intelligent quality optimisation preserves maximum visible quality.

**Result:** Images uploaded at ~10MB will be served at 1–4MB while remaining sharp and detailed on the catalogue. Videos are passed through unmodified (already compressed by the recording device).
