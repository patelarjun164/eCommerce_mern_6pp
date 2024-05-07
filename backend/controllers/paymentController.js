const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const crypto = require("crypto");
const Razorpay = require('razorpay');

exports.processPayment = tryCatchWrapper(async (req, res, next) => {

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });

});

exports.validatePayment = tryCatchWrapper(async (req, res, next) => {

    // console.log("reqbody", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    // console.log("body", body);

    const expectedSignature = crypto
        .createHmac("sha256", "ox91WICI2X6T0WD5CI1KSmeG")
        .update(body.toString())
        .digest("hex");

        // console.log("expectedSig", expectedSignature);

    const isAuthentic = (expectedSignature === razorpay_signature);

    // console.log("isAuthentic", isAuthentic);
    if (isAuthentic) {

        res.status(200).json({
            success: true,
            status: "succeeded",
            razorpay_order_id,
            razorpay_payment_id,
        });
    } else {
        res.status(400).json({
            success: false,
            status: "failed",
        });
    }
});

exports.sendRazorpayKey = tryCatchWrapper(async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
});