const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.signIn);
router.post("/createUser", UserController.createUser);


router.post("/login", UserController.userLogin);

router.post("/googleLogin", UserController.googleLogin);

router.post("/facebookLogin", UserController.facebookLogin);

router.put('/forgot-password', UserController.forgotPassword);

router.put('/reset-password', UserController.resetPassword);

module.exports = router;
