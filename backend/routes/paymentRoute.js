const express = require("express");
const {
  processPayment,
  validatePayment,
  sendRazorpayKey,
} = require("../controllers/paymentController");

const router = express.Router();

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/payment/process").post(isAuthenticatedUser,processPayment);

router.route("/payment/validate").post(isAuthenticatedUser,validatePayment);

router.route("/payment/getRzpKey").get(isAuthenticatedUser,sendRazorpayKey);

module.exports = router;