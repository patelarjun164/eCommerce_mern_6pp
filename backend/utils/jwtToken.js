const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    res.cookie('token', token, {
        expires: new Date(Date.noew() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
       httpOnly: true, 
    });

    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
}

module.exports = sendToken;
