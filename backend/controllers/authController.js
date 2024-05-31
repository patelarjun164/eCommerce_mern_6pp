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
const { LocalStorage } = require('node-localstorage');

if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

const localStorage = new LocalStorage('./scratch');
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

    const authData = {}
    authData.email = email;
    authData.challange = challengePayload.challenge;
    localStorage.setItem('authData', JSON.stringify(authData));
    // const value = localStorage.getItem('authData');
    // console.log("authData", JSON.parse(value));

    return res.status(200).json({ options: challengePayload, regChallange: challengePayload.challenge, success: true });
});

exports.registerVerify = tryCatchWrapper(async (req, res) => {
    const { cred } = req.body;
    const authData = JSON.parse(localStorage.getItem('authData'));
    const challenge = authData.challange;
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

    // userStore[userId] = {...userStore[userId], passkey: verificationResult.registrationInfo};
    // console.log("user", userStore[userId]);
    // localStorage.setItem('passkey', verificationResult.registrationInfo);

    // console.log(localStorage.getItem('passkey'), localStorage.getItem('challange'))
    authData.passkey = verificationResult.registrationInfo;
    localStorage.setItem('authData', JSON.stringify(authData));

    return res.status(200).json({ verified: true });
});

exports.loginChallenge = tryCatchWrapper(async (req, res, next) => {
    const email = req.body.email;
    const authData = JSON.parse(localStorage.getItem('authData'));
    if(authData.email.toString() !== email.toString()){
        return next(new ErrorHandler("Email is Not Registered with this Device to use biometrics", 404));
    }
    const opts = await generateAuthenticationOptions({
        rpID: 'localhost',
    })

    const challangeStore = {};
    challangeStore.logChallange = opts.challenge;
    localStorage.setItem('challangeStore', JSON.stringify(challangeStore));

    return res.status(200).json({ options: opts });
});

exports.loginVerify = tryCatchWrapper(async (req, res) => {
    // const email = req.body.email;
    const {cred} = req.body;
    const authData = JSON.parse(localStorage.getItem('authData'));
    const challenge = JSON.parse(localStorage.getItem('challangeStore'));
    console.log("challnage", challenge, "paskey", authData)
    const result = await verifyAuthenticationResponse({
        expectedChallenge: challenge.logChallange,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        response: cred,
        authenticator: authData.passkey
    })

    if (!result.verified) return res.json({ error: 'something went wrong' })
    console.log("Generate TOken");
    // Login the user: Session, Cookies, JWT
    return res.json({ success: true })
});
