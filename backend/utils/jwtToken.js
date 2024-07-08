const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    res.cookie('token', token, {
       httpOnly: true, 
    });

    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
}

module.exports = sendToken;
