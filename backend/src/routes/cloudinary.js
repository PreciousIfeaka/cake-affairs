const router = require('express').Router();
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

router.get('/signature', auth, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.query.folder || 'cake-affairs';

    const paramsToSign = {
      folder,
      timestamp
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

module.exports = router;
