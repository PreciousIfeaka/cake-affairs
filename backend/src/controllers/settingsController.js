const { getPool } = require('../db/migrations');
const cloudinary = require('../config/cloudinary');

async function getSetting(req, res) {
  try {
    const db = getPool();
    const { key } = req.params;
    const result = await db.query('SELECT value FROM settings WHERE key = $1', [key]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Setting not found' });
    res.json({ key, value: row.value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get setting' });
  }
}

async function updateSetting(req, res) {
  try {
    const db = getPool();
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'value is required' });
    
    await db.query(`
      INSERT INTO settings (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, [key, value]);
    
    res.json({ key, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update setting' });
  }
}

// PUT /api/settings/gallery-image (admin only, JSON request)
// Replaces the old banner image in Cloudinary with the new one uploaded directly from the client.
async function uploadGalleryImage(req, res) {
  try {
    const { url, public_id } = req.body;
    if (!url || !public_id) {
      return res.status(400).json({ error: 'url and public_id are required' });
    }

    const db = getPool();

    // Fetch old public_id so we can delete it from Cloudinary
    const oldPublicIdRow = await db.query(
      "SELECT value FROM settings WHERE key = 'gallery_image_public_id'"
    );
    const oldPublicId = oldPublicIdRow.rows[0]?.value || null;

    // Delete old Cloudinary image (best-effort)
    if (oldPublicId && oldPublicId.trim() !== '') {
      cloudinary.uploader.destroy(oldPublicId, { resource_type: 'image' }).catch(console.warn);
    }

    // Persist the new URL and public_id
    const upsert = `
      INSERT INTO settings (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
    await Promise.all([
      db.query(upsert, ['gallery_image_url',       url]),
      db.query(upsert, ['gallery_image_public_id', public_id]),
    ]);

    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update gallery image settings' });
  }
}

module.exports = { getSetting, updateSetting, uploadGalleryImage };
