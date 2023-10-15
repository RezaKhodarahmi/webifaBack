const express = require("express");
const router = express.Router();
const TeamController = require("../../../../controller/api/v1/team");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", TeamController.getTeams);
router.post("/", TeamController.createTeam);
router.patch("/", TeamController.updateTeam);
router.get("/:id", TeamController.getSingleTeam);
router.delete("/:id", TeamController.deleteTeam);

module.exports = router;
