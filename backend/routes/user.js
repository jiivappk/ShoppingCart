const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.signIn);
router.post("/createUser", UserController.createUser);
router.post("/editUser", UserController.editUser);


router.post("/login", UserController.userLogin);

router.post("/googleLogin", UserController.googleLogin);

router.post("/facebookLogin", UserController.facebookLogin);

router.put('/forgot-password', UserController.forgetPassword);

router.put('/reset-password', UserController.resetPassword);

router.post('/change-mailId', UserController.changeMailId);

router.post('/update-email', UserController.updateEmail);

router.put('/reset-token', UserController.clearVerificationLink)

module.exports = router;
