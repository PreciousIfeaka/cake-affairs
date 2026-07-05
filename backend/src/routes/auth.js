const router = require('express').Router();
const validate = require('../middleware/validate');
const { otpRequestSchema, otpVerifySchema } = require('../middleware/schemas');
const ctrl = require('../controllers/authController');

router.post('/otp', validate(otpRequestSchema, 'body'), ctrl.requestOTP);
router.post('/verify', validate(otpVerifySchema, 'body'), ctrl.verifyOTP);

module.exports = router;
