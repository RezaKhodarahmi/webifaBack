const express = require("express");
const controller = require("../controller/AuthController");
const router = express.Router();

router.post("/register", controller.handelRegister);
router.post("/login", controller.handelLogin);
router.post("/user/login", controller.handelUserLogin);
router.post("/forget-password", controller.HandleRequestForgetPass);
router.post("/forget-password/verify", controller.HandleVerifyForgetPass);
router.post("/forget-password/reset", controller.HandleResetForgetPass);

module.exports = router;
