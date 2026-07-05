const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} = require('../middleware/schemas');
const ctrl = require('../controllers/authController');

router.post('/login', validate(loginSchema, 'body'), ctrl.login);
router.post('/logout', ctrl.logout);
router.post('/forgot-password', validate(forgotPasswordSchema, 'body'), ctrl.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema, 'body'), ctrl.resetPassword);
router.post('/change-password', auth, validate(changePasswordSchema, 'body'), ctrl.changePassword);

module.exports = router;
