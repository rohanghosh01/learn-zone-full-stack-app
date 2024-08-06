const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/user.controller");
const tokenMiddleware = require("../middlewares/token.middleware");

// Pre-middleware
// router.use(languageMiddleware);

// Define routes with token middleware where needed
router.get("/user/profile", tokenMiddleware, userController.profile);
router.patch("/user/profile", tokenMiddleware, userController.updateProfile);
router.post(
  "/user/changePassword",
  tokenMiddleware,
  userController.changePassword
);
router.get("/users", tokenMiddleware, userController.userList);

module.exports = router;
