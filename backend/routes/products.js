const express = require("express");

const ProductController = require("../controllers/products");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const extractProductReviewFile = require("../middleware/product-review-file");

const router = express.Router();

router.post("", checkAuth, extractFile, ProductController.createProduct);

router.put("/:id", checkAuth, extractFile, ProductController.updateProduct);

// router.post("", checkAuth, ProductController.createProduct);

// router.put("/:id", checkAuth, ProductController.updateProduct);

router.get("", ProductController.getProducts);

router.get("/category", ProductController.categoryList);

router.get("/:id", ProductController.getProduct);

router.delete("/:id", checkAuth, ProductController.deleteProduct);

module.exports = router;
