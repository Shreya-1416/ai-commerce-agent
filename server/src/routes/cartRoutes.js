const express = require("express");

const {
  addToCart,
  getCart,
  clearCart,
} = require("../controllers/CartController");

const router = express.Router();

router.post("/add", addToCart);
router.get("/:sessionId", getCart);
router.delete("/clear", clearCart);

module.exports = router;