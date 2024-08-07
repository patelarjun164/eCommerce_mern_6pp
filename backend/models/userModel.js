const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot Exceed 30 character"],
        minLength: [4, "Name Should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
        minLength: [5, "Password Should have more than 5 characters"],
        select: false, //it will not give password field if query raised of any user
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    totalEarningAmount: {
        type: Number,
        default:0
    },
    emailVerified: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    emailVerificationToken: String,
    emailVerificationExpire: Date,

    username: String,
    passkeys: [Object],
    registrationOptions: Object,
    currentAuthOptions: Object,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and add to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

//Generating Email Verification Token
userSchema.methods.emailVerfTokenGenerate = function () {

    //Generating Token
    const veificationToken = crypto.randomBytes(20).toString("hex");

    //Hashing and add to userSchema
    this.emailVerificationToken = crypto
        .createHash("sha256")
        .update(veificationToken)
        .digest("hex");

    this.emailVerificationExpire = Date.now() + 15 * 60 * 1000;

    return veificationToken;
}

module.exports = mongoose.model("User", userSchema);