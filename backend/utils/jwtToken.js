const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    res.cookie('token', token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
       httpOnly: true,
       secure: true,
       sameSite: 'Lax', // Adjust SameSite attribute as needed
    });

    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
}

module.exports = sendToken;
