const express = require("express");
const router = express.Router();
const OtpController = require("../../../../controller/api/v1/otp");

router.post("/send", OtpController.sendSMS);
router.patch("/verify", OtpController.verify);

module.exports = router;
