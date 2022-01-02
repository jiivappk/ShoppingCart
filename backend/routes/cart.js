const express = require("express");

// const PostController = require("../controllers/posts");
const CartController = require("../controllers/cart");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

// router.post("", checkAuth, extractFile, CartController.createCartItem);
router.post("", CartController.createCartItem);

// router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", CartController.getCartItems);

// router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, CartController.deleteCartItem);

module.exports = router;
