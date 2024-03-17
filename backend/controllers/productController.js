const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');


//Create Product -- Admin
exports.createProduct = tryCatchWrapper(async (req, res, next) => {

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    })
});

//Get all products
exports.getAllProducts = tryCatchWrapper(async (req, res, next) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apiFeature.query;
    // const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    })
});


//Get Product Deatils
exports.getProductDetails = tryCatchWrapper(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return (next(new ErrorHandler("product Not found", 404)));
    }

    res.status(200).json({
        success: true,
        product,
        productCount,
    })

});

//Update product details -- Admin
exports.updateProduct = tryCatchWrapper(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return (next(new ErrorHandler("product Not found", 404)));
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
})

//Delete a product -- Admin
exports.deleteProduct = tryCatchWrapper(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return (next(new ErrorHandler("product Not found", 404)));
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: `Product with the id ${req.params.id} has been deleted...!`,
    })
});