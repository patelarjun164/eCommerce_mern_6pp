const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const sendVerificationEmail = require('../utils/sendVerificationEmail');



//Register a User 
exports.registerUser = tryCatchWrapper(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    await sendVerificationEmail(user, res);

    // sendToken(user, 201, res);
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

    if(user.emailVerified) {
        sendToken(user, 200, res);
    } else {
        await sendVerificationEmail(user, res);
        return;
    }
});

//Logout User
exports.logoutUser = tryCatchWrapper(async (req, res, next) => {

    //options for cookie
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
    }

    res.status(200).cookie("token", null, options).json({
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

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Hi ${user.name},\n\nWe received a request to reset your password for your account. Click the link below to reset your password:\n\n${resetPasswordUrl}\n\nIf you did not request a password reset, please ignore this email. This link will expire in 24 hours.\n\nThank you,\nThe ShoppyNexxa Team`;

    try {

        await sendEmail({
            email: user.email,
            subject: `ShoppyNexxa Password Recovery`,
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

//Generet Email For User verification - Used for resent Only
exports.generateVerfEmail = tryCatchWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    await  sendVerificationEmail(user, res);
})

//Verify Email
exports.verifyEmail = tryCatchWrapper(async (req, res, next) => {
    //Creating token hash
    const emailVerificationToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Email Verification Token is invalid or has been expired", 400));
    }

    user.emailVerified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    req.user = user;
    res.status(200).json({
        success: true,
        message: `Verify User Successfully...!`,
    });
});

//Get User Details
exports.getUserDetails = tryCatchWrapper(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
})

//Update user password
exports.updatePassword = tryCatchWrapper(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    const isNewPasswordSame = await user.comparePassword(req.body.newPassword);
    if (isNewPasswordSame) {
        return next(new ErrorHandler("New Password should not be same as Old one", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);

    res.status(200).json({
        success: true,
        user,
    });
})

//Update User Profile
exports.updateProfile = tryCatchWrapper(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    if (req.body.avatar !== undefined) {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

//Get All Users --- Admin
exports.getAllUsers = tryCatchWrapper(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//Get Single User --- (Admin)
exports.getSingleUser = tryCatchWrapper(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        user,
    });
});

//Update User Role -- (Admin)
exports.updateUserRole = tryCatchWrapper(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

//Delete User -- (Admin)
exports.deleteUser = tryCatchWrapper(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404))
    }

    //Removing Cloudinary images
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: `User with Id: ${req.params.id} Deleted Successfully.`,
    });
});