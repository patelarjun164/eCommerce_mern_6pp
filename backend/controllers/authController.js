const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
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

    const user = await User.findOne({ email: req.user.email });
    // Generate registration options
    const options = await generateRegistrationOptions({
        rpName: 'ShoppyNexa',
        rpID: 'localhost',
        userName: user.email,
        attestationType: 'none',
        excludeCredentials: user.passkeys.map(passkey => ({
            id: passkey.id,
            transports: passkey.transports,
        })),
        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred',
            // Optional
            // authenticatorAttachment: 'platform',
        },
    });


    user.registrationOptions = options;
    await user.save();

    return res.status(200).json({ options: options, success: true });
});

exports.registerVerify = tryCatchWrapper(async (req, res) => {
    const { user } = req;
    const currentOptions = user.registrationOptions;
    const verification = await verifyRegistrationResponse({
        response: req.body.cred,
        expectedChallenge: currentOptions.challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
    });
    const { verified, registrationInfo } = verification;
    const {
        credentialID,
        credentialPublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
    } = registrationInfo;
    const newPasskey = {
        webAuthnUserID: currentOptions.user.id,
        id: credentialID,
        publicKey: credentialPublicKey,
        counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: req.body.cred.response.transports,
    }

    user.passkeys = [...user.passkeys, newPasskey];
    await user.save()

    return res.status(200).json({ verified });
});

exports.loginChallenge = tryCatchWrapper(async (req, res, next) => {
    const { email } = req.body;

    //checking weather email and password entered by user or not
    if (!email) {
        return (next(new ErrorHandler("Please Enter Email And Password", 400)))
    }

    const user = await User.findOne({ email: email });
    //checking weather user is exist or not
    if (!user) {
        return (next(new ErrorHandler("Invalid Email or Password", 401)));
    }

    if (!user.registrationOptions) {
        return next(new ErrorHandler("To use Passwordless login, you need to register your biometrics first...!", 404));
    }

    const options = await generateAuthenticationOptions({
        rpID: 'localhost',
        allowCredentials: user.passkeys.map(passkey => ({
            id: passkey.id,
            transports: passkey.transports,
        })),
    });

    // console.log("options", options);

    // localStorage.setItem("currentAuthOptions", JSON.stringify(options));
    user.currentAuthOptions = options;
    await user.save();

    return res.status(200).json({ options: options, success: true });
});

exports.loginVerify = tryCatchWrapper(async (req, res, next) => {

    try {

        const { email, authResult } = req.body;
        // console.log("authResult", authResult);
        const user = await User.findOne({ email: email });
        const currentOptions = user.currentAuthOptions;
        const passkeys = user.passkeys.filter(psk => psk.id == authResult.id);
        const [passkey] = passkeys;
        // console.log("passkey", passkey);
        // console.log("currentOptiions", currentOptions);

        const verification = await verifyAuthenticationResponse({
            response: authResult,
            expectedChallenge: currentOptions.challenge,
            expectedOrigin: 'http://localhost:3000',
            expectedRPID: 'localhost',
            authenticator: {
                credentialID: passkey.id,
                credentialPublicKey: passkey.publicKey.buffer,
                counter: passkey.counter,
                transports: passkey.transports,
            }
        });

        // console.log("result", verification);
        const { authenticationInfo, verified } = verification;
        const { newCounter } = authenticationInfo;
        if (verified) {
            user.currentAuthOptions = {};
            user.passkeys.forEach((psk) => {
                if(psk.id === passkey.id){
                    psk.counter = newCounter;
                }
            });
            await user.save();
            sendToken(user, 200, res);
        } else {
            return (next(new ErrorHandler("Fingerprint verification failed. Please try again.", 401)))
        }
        

    } catch (error) {
        return (next(new ErrorHandler("Error Occured...!", 401)))
    }
});
