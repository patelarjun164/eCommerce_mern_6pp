const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');


//Create Product -- Admin
exports.createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    })
}

//Get all products
exports.getAllProducts = async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
}

//Get Product Deatils
exports.getProductDetails = async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        console.log("ErrP");
       //return (next(new ErrorHandler("product Not found",404)));
         const error = new ErrorHandler("Product Not Found", 404);
         return next(error);
    }

    res.status(200).json({
        success: true,
        product,
    })
}

//Update product details -- Admin
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product,
    })
}

//Delete a product -- Admin
exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: `Product with the id ${req.params.id} has been deleted...!`,
    })
}