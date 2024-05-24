const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse
} = require('@simplewebauthn/server');

if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

//Reigster Biometrics
exports.registerChallenge = tryCatchWrapper(async (req, res) => {

    const user = req.user;
    const challengePayload = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'ShppyNexa Localhost Machine',
        attestationType: 'none',
        userName: user.email,
        timeout: 30_000,
    })

    console.log("challengePayload", challengePayload);
    console.log("challengePayload.challenge", challengePayload.challenge);

    return res.status(200).json({ options: challengePayload , success: true});
});