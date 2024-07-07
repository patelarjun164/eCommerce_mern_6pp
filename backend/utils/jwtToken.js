const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //options for cookie
    const options = {
        Expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 
        ),
        Secure: true,
        SameSite: 'None'
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
}

module.exports = sendToken;