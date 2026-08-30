const express = require("express");

const {
  addToCart,
  getCart,
} = require("../controllers/CartController");

const router = express.Router();

router.post("/add", addToCart);
router.get("/:sessionId", getCart);

module.exports = router;