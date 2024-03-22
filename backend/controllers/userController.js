const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

//Register a User 
exports.registerUser = tryCatchWrapper(async (req, res, next) => {

    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "SampleProfilePic",
        },
    });

    sendToken(user, 201, res);

    //Wrap in sendToken Function
    // const token = user.getJWTToken();
    // res.status(201).json({
    //     success: true,
    //     token,
    // })

});

//Login User
exports.loginUser = tryCatchWrapper(async (req, res, next) => {

    const { email, password } = req.body;

    //checking weather email and password entered by user or not
    if (!email || !password) {
        return (next(new ErrorHandler("Please Enter Email And Password", 400)))
    }

    const user = await User.findOne({ email }).select("+password");

    //checking weather user is exist or not
    if (!user) {
        return (next(new ErrorHandler("Invalid Email or Password", 401)));
    }

    //compare password entered by user and db password
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return (next(new ErrorHandler("Invalid Email Or Password", 401)))
    }

    sendToken(user, 200, res);

    //wrap in sendToken Function
    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success: true,
    //     token,
    // })
});

//Logout User
exports.logoutUser = tryCatchWrapper(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httponly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out!",
    });
});

//Forgot Password
exports.forgotPassword = tryCatchWrapper(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found!", 404));
    }

    //Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Website Password Recovery`,
            message: message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password
exports.resetPassword = tryCatchWrapper(async (req, res, next) => {

    //Creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do NOT match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});