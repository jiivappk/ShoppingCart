const express = require("express");

const ProductReviewController = require("../controllers/product-review");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const extractProductReviewFile = require("../middleware/product-review-file");

const router = express.Router();

router.get("/single-review", ProductReviewController.getSingleProductReview);

router.get("", ProductReviewController.getProductReviews);

router.post("/add-review", checkAuth, extractProductReviewFile, ProductReviewController.addProductReview);


module.exports = router;
