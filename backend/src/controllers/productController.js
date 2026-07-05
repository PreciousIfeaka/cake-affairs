const { getPool } = require('../db/migrations');
const cloudinary = require('../config/cloudinary');
const { nanoid } = require('nanoid');

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function listProducts(req, res) {
  try {
    const db = getPool();
    const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let idx = 1;

    if (category) {
      query += ` AND LOWER(category_slug) = LOWER($${idx++})`;
      params.push(category);
    }
    if (minPrice) {
      query += ` AND price >= $${idx++}`;
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ` AND price <= $${idx++}`;
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      query += ` AND (LOWER(name) LIKE LOWER($${idx}) OR LOWER(description) LIKE LOWER($${idx}))`;
      params.push(`%${search}%`);
      idx++;
    }

    const countQuery = query.replace('SELECT * FROM products', 'SELECT COUNT(*) as total FROM products');
    const countParams = [...params];

    query += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(parseInt(limit), offset);

    const productsResult = await db.query(query, params);
    const countResult = await db.query(countQuery, countParams);

    const products = productsResult.rows;
    const total = parseInt(countResult.rows[0]?.total || 0);

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

async function listCategories(req, res) {
  try {
    const db = getPool();
    const result = await db.query(
      'SELECT DISTINCT category, category_slug FROM products WHERE category IS NOT NULL AND category_slug IS NOT NULL ORDER BY category ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list categories' });
  }
}

// GET /api/products/category-samples — first product (with image) per category
async function listCategorySamples(req, res) {
  try {
    const db = getPool();
    // Use DISTINCT ON to grab the first product per category ordered by created_at
    const result = await db.query(`
      SELECT DISTINCT ON (category_slug) id, category, category_slug, name, image_url
      FROM products
      WHERE image_url IS NOT NULL AND category_slug IS NOT NULL
      ORDER BY category_slug, created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load category samples' });
  }
}

async function getProduct(req, res) {
  try {
    const db = getPool();
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const product = result.rows[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get product' });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, category, badge, image_url, video_url, public_id } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price and category are required' });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number' });
    }

    const id = nanoid(10);
    const db = getPool();

    await db.query(`
      INSERT INTO products (id, name, description, price, category, category_slug, image_url, video_url, public_id, badge)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id,
      name,
      description || null,
      parseFloat(price),
      category,
      slugify(category),
      image_url || null,
      video_url || null,
      public_id || null,
      badge || null
    ]);

    const createdResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    res.status(201).json(createdResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

// PUT /api/products/:id (admin only)
async function updateProduct(req, res) {
  try {
    const db = getPool();
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const existing = result.rows[0];
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, category, badge, image_url, video_url, public_id } = req.body;

    const hasImageChange = req.body.hasOwnProperty('public_id');
    let finalImageUrl = existing.image_url;
    let finalVideoUrl = existing.video_url;
    let finalPublicId = existing.public_id;

    if (hasImageChange) {
      finalImageUrl = image_url || null;
      finalVideoUrl = video_url || null;
      finalPublicId = public_id || null;

      // Delete old file if there was one and it is being replaced or removed
      if (existing.public_id && existing.public_id !== finalPublicId) {
        cloudinary.uploader.destroy(existing.public_id, {
          resource_type: existing.video_url ? 'video' : 'image',
        }).catch(console.warn);
      }
    }

    await db.query(`
      UPDATE products
      SET name=$1, description=$2, price=$3, category=$4, category_slug=$5, image_url=$6, video_url=$7, public_id=$8, badge=$9,
          updated_at=CURRENT_TIMESTAMP
      WHERE id=$10
    `, [
      name || existing.name,
      description !== undefined ? description : existing.description,
      price ? parseFloat(price) : existing.price,
      category || existing.category,
      category ? slugify(category) : existing.category_slug,
      finalImageUrl,
      finalVideoUrl,
      finalPublicId,
      badge !== undefined ? badge : existing.badge,
      req.params.id
    ]);

    const updatedResult = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.json(updatedResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// DELETE /api/products/:id (admin only)
async function deleteProduct(req, res) {
  try {
    const db = getPool();
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const product = result.rows[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id, {
        resource_type: product.video_url ? 'video' : 'image',
      }).catch(console.warn);
    }

    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = { listProducts, listCategories, listCategorySamples, getProduct, createProduct, updateProduct, deleteProduct };
