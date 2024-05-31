const express = require('express');
const { registerChallenge, registerVerify, loginChallenge, loginVerify} = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.route('/bioauth/register-challenge').post(isAuthenticatedUser, registerChallenge);
router.route('/bioauth/register-verify').post(isAuthenticatedUser, registerVerify);

router.route('/bioauth/login-challenge').post(loginChallenge);
router.route('/bioauth/login-verify').post(loginVerify);

module.exports = router;