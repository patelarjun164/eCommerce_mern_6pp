const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');


//Create Product -- Admin
exports.createProduct = async (req, res, next) => {

    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product,
        })
    } catch (error) {
        next(error);
    }
};

//Get all products
exports.getAllProducts = async (req, res) => {
    
    try {
        const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();
        const products = await apiFeature.query;
        // const products = await Product.find();
    
        res.status(200).json({
            success: true,
            products,
        })
    } catch (error) {
        next(error);
    }
}


//Get Product Deatils
exports.getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
    
        if (!product) {
            return (next(new ErrorHandler("product Not found", 404)));
        }
    
        res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        next(error);
    }
}

//Update product details -- Admin
exports.updateProduct = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
}

//Delete a product -- Admin
exports.deleteProduct = async (req, res, next) => {

    try {
        let product = await Product.findById(req.params.id);
    
        if (!product) {
            return (next(new ErrorHandler("product Not found", 404)));
        }
    
        await product.deleteOne();
        res.status(200).json({
            success: true,
            message: `Product with the id ${req.params.id} has been deleted...!`,
        })
    } catch (error) {
        next(error);
    }
}