const tryCatchWrapper = require('../middleware/tryCatchWrapper');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

//Create Product -- Admin
exports.createProduct = tryCatchWrapper(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images.flat(Infinity);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    console.log("imageslink", imagesLinks);

    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    })
});

//Get all products
exports.getAllProducts = tryCatchWrapper(async (req, res, next) => {

    const resultPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()


    // By calling .clone(), you create a copy of the original query object before applying pagination. This allows you to independently get the filtered count and then the paginated results.
    let products = await apiFeature.query.clone();

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
});

//Get all products -- Admin
exports.getAdminProducts = tryCatchWrapper(async (req, res, next) => {

    const products = await Product.find();

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
    })

});

//Update product details -- Admin
exports.updateProduct = tryCatchWrapper(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return (next(new ErrorHandler("product Not found", 404)));
    }

    // Images Start Here
    let images = [];
    console.log("reqBody", req.body.images);

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images ? req.body.images.flat(Infinity) : undefined;
        console.log("image safter con check -- else part", images)
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        // product.images.forEach(async (img) => {
        //     await cloudinary.v2.uploader.destroy(img.public_id);
        // })
        console.log("cloudinary loop working fine", images);

        for (let i = 0; i < product.images.length; i++) {
            console.log("enterting destroyed loop", product.images[i].public_id);
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            console.log("enter upload loop");
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
        console.log("reBOdy after cloudinary", req.body.images);
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

    // Deleting Images From Cloudinary
    product.images.forEach(async (img) => {
        await cloudinary.v2.uploader.destroy(img.public_id);
    })

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: `Product with the name ${product.name} and id ${req.params.id} has been deleted...!`,
    })
});

//Create new review or Update review
exports.createProductReview = tryCatchWrapper(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        avatar: req.user.avatar.url,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);


    const isReviewed = !!(product.reviews.find((rev) => {
        return rev.user.toString() === req.user._id.toString();
    }));
    //Here find method returnting object if rev and req is same, so to convert into boolean from object !! added to code.

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    }
    else {
        product.reviews.unshift(review);
        product.numOfReviews = product.reviews.length;
    }

    let totalRating = 0;

    product.reviews.forEach((rev) => {
        totalRating += rev.rating;
    });

    product.ratings = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        product,
    });
});

//Get All reviews of a product
exports.getProductReviews = tryCatchWrapper(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler(`Product does not exist with Id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//Delete a review
exports.deleteReview = tryCatchWrapper(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler(`Product does not exist with Id: ${req.params.id}`, 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let totalRating = 0;

    reviews.forEach((rev) => {
        totalRating += rev.rating;
    });

    const ratings = totalRating / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    })

    res.status(200).json({
        success: true,
    });
})