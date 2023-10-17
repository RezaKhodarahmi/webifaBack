const express = require("express");
const router = express.Router();
const ProjectController = require("../../../../controller/api/v1/project");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", ProjectController.getProjects);
router.get("/teams/all", ProjectController.getTeams);
router.post("/", ProjectController.createProject);
router.patch("/", ProjectController.updateProject);
router.get("/:id", ProjectController.getSingleProject);
router.delete("/:id", ProjectController.deleteProject);

module.exports = router;
