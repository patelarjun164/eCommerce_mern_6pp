const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const tryCatchWrapper = require("./tryCatchWrapper");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = tryCatchWrapper(async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler("Please Login to access this resourse", 401));
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedData);

        const user = await User.findById(decodedData.id);

        if (!user.emailVerified) {
            return next(new ErrorHandler("Email verification required. Please check your inbox and verify your email to log in.", 403));
        }

        req.user = user;
        // console.log(req.user);
        next();
    } catch (error) {
        next(new ErrorHandler(error, 401));
    }

});

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        // console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`, 403
                ));
        }

        next();
    };
};
