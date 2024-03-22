const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser,authorizedRoles("admin"), createProduct);

router
    .route("/product/:id")
    .get(getProductDetails)
    .put(isAuthenticatedUser,authorizedRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser,authorizedRoles("admin"), deleteProduct);

module.exports = router;