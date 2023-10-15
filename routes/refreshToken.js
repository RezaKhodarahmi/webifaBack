const { Router } = require("express");

const refreshTokenController = require("../controller/RefreshTokenController");
const router = Router();

router.post("/",refreshTokenController.HandleRefreshToken);
router.delete("/",refreshTokenController.HandleLogout);


module.exports = router

