const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { settingKeySchema, updateSettingSchema } = require('../middleware/schemas');
const ctrl = require('../controllers/settingsController');

router.put('/gallery-image', auth, ctrl.uploadGalleryImage);

router.get('/:key', validate(settingKeySchema, 'params'), ctrl.getSetting);
router.put('/:key', auth, validate(settingKeySchema, 'params'), validate(updateSettingSchema, 'body'), ctrl.updateSetting);

module.exports = router;

