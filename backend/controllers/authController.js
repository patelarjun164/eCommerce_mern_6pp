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

const challengeStore = {};
const userStore = {};

//Reigster Biometrics
exports.registerChallenge = tryCatchWrapper(async (req, res) => {

    const userId = req.user.email;
    const challengePayload = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'ShppyNexa Localhost Machine',
        attestationType: 'none',
        userName: req.user.name,
        timeout: 30_000,
    })

    console.log("challengePayload", challengePayload);
    console.log("challengePayload.challenge", challengePayload.challenge);

    challengeStore[userId] = challengePayload.challenge

    return res.status(200).json({ options: challengePayload , success: true});
});

exports.registerVerify = tryCatchWrapper(async (req, res) => {
    const { cred } = req.body;
    const userId = req.user.email;
    const challenge = challengeStore[userId];
    console.log("challange", challenge);
    
    console.log("challangeHello");
    const verificationResult = await verifyRegistrationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        response: cred,
    });

    console.log(verificationResult)

    if (!verificationResult.verified) return res.json({ error: 'could not verify' });
    const passkey = verificationResult.registrationInfo;

    return res.status(200).json({ verified: true });
});