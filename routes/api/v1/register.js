const express = require("express");
const router = express.Router();
const RegisterController = require("../../../controller/RegisterController");

router.post("/register", RegisterController.handelRegister);

module.exports = router;
