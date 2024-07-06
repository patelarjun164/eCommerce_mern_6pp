const sendEmail = require('../utils/sendEmail');

//Genetate Token for email Verification
const emailVerifyMailSent = async (user, res) => {

    //Get Reset Password Token
    const verificationToken = user.emailVerfTokenGenerate();

    await user.save({ validateBeforeSave: false });

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const emalVerifyUrl = `${process.env.FRONTEND_URL}/user/${user._id}/verify/${verificationToken}`;

    const message = `Hi Arjun Real,\n\nThank you for choosing ShoppyNexxa!\n\nTo complete your registration or login and verify your email address, please click the link below:\n\n${emalVerifyUrl}\n\nIf you did not request this email, please disregard it.\n\nThank you,\nTheShoppyNexxa Team\n`;

    try {

        await sendEmail({
            email: user.email,
            subject: `Verify Your Email Address for ShoppyNexxa`,
            message: message,
        });

        res.status(200).json({
            success: true,
            mailSent: true,
            message: `Verification email sent! Please check your inbox.`,
        });

    } catch (error) {
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(`Failed to sent Email Verification mail, Error:\n ${error.message}`, 500));
    }
}

module.exports = emailVerifyMailSent;