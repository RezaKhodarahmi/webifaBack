const express = require("express");
const router = express.Router();
router.get("/register", (req, res) => {
  return res.status(200).json({
    message: "The first route is work",
  });
});

module.exports = router;
