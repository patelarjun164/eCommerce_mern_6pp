const express = require('express');
const { registerChallenge, registerVerify } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.route('/bioauth/register-challenge').post(isAuthenticatedUser, registerChallenge);
router.route('/bioauth/register-verify').post(isAuthenticatedUser, registerVerify);

module.exports = router;