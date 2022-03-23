const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/orders");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");


router.post("", checkAuth, OrderController.createOrder);

// router.put("/:id", checkAuth, extractFile, ProductController.updateProduct);

router.get("", OrderController.getOrderItems);

// router.get("/:id", ProductController.getProduct);

// router.delete("/:id", checkAuth, ProductController.deleteProduct);

module.exports = router;
