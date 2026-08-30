const express = require("express");

const router = express.Router();

const {
  createOrder,
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/OrderController");

router.post("/", createOrder);

router.post("/payment", createPaymentOrder);

router.post("/payment/verify", verifyPayment);

module.exports = router;