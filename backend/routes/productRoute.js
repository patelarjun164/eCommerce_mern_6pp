const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(isAuthenticatedUser,authorizedRoles("admin"), getAllProducts);
router.route("/product/new").post(isAuthenticatedUser, createProduct);

router
    .route("/product/:id")
    .get(getProductDetails)
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, deleteProduct);

module.exports = router;