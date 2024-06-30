const Order = require('../models/orderModel');
const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
const User = require('../models/userModel');

//Create new order
exports.newOrder = tryCatchWrapper(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        sucess: true,
        order,
    });
});

//Get Single Order
exports.getSingleOrder = tryCatchWrapper(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate(
        "user", "name email"
    );

    if (!order) {
        return (next(new ErrorHandler("Order Not found with this Id", 404)));
    }

    res.status(200).json({
        success: true,
        order
    });
});

//Get Logged in user's Orders
exports.myOrders = tryCatchWrapper(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        return (next(new ErrorHandler("You've not placed any order yet", 404)));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

//Get All Orders  -- Admin
exports.getAllOrders = tryCatchWrapper(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update Order Status  -- Admin
async function updateStock(productId, quantity) {
    await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } }
    )
}

exports.updateOrder = tryCatchWrapper(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return (next(new ErrorHandler("Order Not found with this Id", 404)));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You Have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        let sellerDetails = [];
        order.orderItems.forEach((item) => {
            sellerDetails.push({
                sellerId: item.seller,
                earning: item.quantity * item.price,
            });
        });
        sellerDetails.forEach(async (slr) => {
            const seller = await User.findById(slr.sellerId);
            seller.totalEarningAmount += slr.earning;
            await seller.save();
        })
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    });
});

//Delete order --- Admin
exports.deleteOrder = tryCatchWrapper(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return (next(new ErrorHandler("Order Not found with this Id", 404)));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: `Order with orderId: ${req.params.id} Deleted Succesfully!`
    });
});
