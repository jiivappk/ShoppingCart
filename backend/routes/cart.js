const express = require("express");

// const ProductController = require("../controllers/products");
const CartController = require("../controllers/cart");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

// router.product("", checkAuth, extractFile, CartController.createCartItem);
router.post("", CartController.createCartItem);

// router.put("/:id", checkAuth, extractFile, ProductController.updateProduct);

router.get("", CartController.getCartItems);

// router.get("/:id", ProductController.getProduct);

router.delete("/:id", checkAuth, CartController.deleteCartItem);

module.exports = router;
