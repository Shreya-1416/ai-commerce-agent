const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require("../controllers/ProductController");

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

module.exports = router;