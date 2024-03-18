const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

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