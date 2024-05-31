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

    const email = req.user.email;
    const challengePayload = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'ShppyNexa Localhost Machine',
        attestationType: 'none',
        userName: req.user.name,
        timeout: 30_000,
    })

    console.log("challengePayload", challengePayload);
    console.log("challengePayload.challenge", challengePayload.challenge);

    //checking weather email and password entered by user or not
    if (!email) {
        return (next(new ErrorHandler("Please Enter Email", 400)))
    }

    const user = await User.findOne({ email });

    //checking weather user is exist or not
    if (!user) {
        return (next(new ErrorHandler("Email is not Valid...!", 401)));
    }

    challengeStore[userId] = challengePayload.challenge

    return res.status(200).json({ options: challengePayload, success: true });
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

    userStore[userId] = {...userStore[userId], passkey: verificationResult.registrationInfo};
    console.log("user", userStore[userId]);

    return res.status(200).json({ verified: true });
});

exports.loginChallenge = tryCatchWrapper(async (req, res) => {
    const userId = req.body.email;

    const opts = await generateAuthenticationOptions({
        rpID: 'localhost',
    })

    challengeStore[userId] = opts.challenge;

    return res.status(200).json({ options: opts });
});

exports.loginVerify = tryCatchWrapper(async (req, res) => {
    const userId = req.body.email;
    const {cred} = req.body;
    const user = userStore[userId];
    const challenge = challengeStore[userId];
    console.log(userStore[userId]);
    const result = await verifyAuthenticationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        response: cred,
        authenticator: user.passkey
    })

    if (!result.verified) return res.json({ error: 'something went wrong' })
    
    // Login the user: Session, Cookies, JWT
    return res.json({ success: true, userId })
});
