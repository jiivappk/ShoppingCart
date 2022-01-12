const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/orders");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");


router.post("", checkAuth, extractFile, OrderController.createOrder);

// router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// router.get("", OrderController.getPosts);

// router.get("/:id", PostController.getPost);

// router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
