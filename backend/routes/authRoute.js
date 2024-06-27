const express = require('express');
const { registerChallenge, registerVerify, loginChallenge, loginVerify} = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.route('/bioauth/generate-registration-options').get(isAuthenticatedUser,registerChallenge);
router.route('/bioauth/verify-registration').post(isAuthenticatedUser,registerVerify);

router.route('/bioauth/generate-authentication-options').post(loginChallenge);
router.route('/bioauth/login-verify').post(loginVerify);

module.exports = router;