const express = require("express");
const router = express.Router();
const UserController = require("../../../../controller/api/v1/users");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.get("/", checkToken, UserController.getUsers);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  UserController.createUser
);
router.get("/:id", checkToken, UserController.getUserWithId);
router.patch(
  "/update",
  checkToken,
  upload.single("image"),
  UserController.updateUser
);

router.post("/authors", checkToken, UserController.getAuthors);
router.post("/teachers", checkToken, UserController.getTeachers);
router.delete("/delete/:id", checkToken, UserController.deleteUser);

module.exports = router;
