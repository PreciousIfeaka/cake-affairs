const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined.');
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : {
        rejectUnauthorized: false
      }
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

async function runMigrations() {
  const db = getPool();
  
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      price       DOUBLE PRECISION NOT NULL CHECK(price >= 0),
      category    TEXT NOT NULL,
      image_url   TEXT,
      video_url   TEXT,
      public_id   TEXT,         -- Cloudinary public_id for deletion
      badge       TEXT,         -- e.g. "Best Seller", "Vegan", "Low Stock"
      created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS category_slug TEXT;
  `);

  await db.query(`
    UPDATE products
    SET category_slug = TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(category, '[^a-zA-Z0-9]+', '-', 'g')))
    WHERE category_slug IS NULL OR category_slug = '';
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS otps (
      email      TEXT PRIMARY KEY,
      code       TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    );
  `);

  await db.query(`
    INSERT INTO settings (key, value)
    VALUES ('whatsapp_number', '2348000000000')
    ON CONFLICT (key) DO NOTHING;
  `);

  await db.query(`
    INSERT INTO settings (key, value)
    VALUES ('gallery_image_url', '')
    ON CONFLICT (key) DO NOTHING;
  `);

  await db.query(`
    INSERT INTO settings (key, value)
    VALUES ('gallery_image_public_id', '')
    ON CONFLICT (key) DO NOTHING;
  `);
}

module.exports = { getPool, runMigrations };
