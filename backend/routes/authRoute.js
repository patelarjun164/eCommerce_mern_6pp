const express = require('express');
const { registerChallenge } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.route('/bioauth/register-challenge').post(isAuthenticatedUser, registerChallenge);

module.exports = router;