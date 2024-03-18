const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const tryCatchWrapper = require("./tryCatchWrapper");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = tryCatchWrapper(async(req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resourse",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decodedData._id);
    next();
});
