const express = require("express");

// const ProductController = require("../controllers/products");
const WishlistController = require("../controllers/wishlist");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

// router.product("", checkAuth, extractFile, CartController.createCartItem);
router.post("", WishlistController.createWishlistItem);

// router.put("/:id", checkAuth, extractFile, ProductController.updateProduct);

router.get("", WishlistController.getWishlistItems);

router.get("/getProductsId", WishlistController.getWishlistProductsId);

// router.get("/:id", ProductController.getProduct);

router.delete("/:id", checkAuth, WishlistController.deleteWishlistItem);


module.exports = router;
