const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/auth.controller");
const languageMiddleware = require("../middlewares/language.middleware");
const tokenMiddleware = require("../middlewares/token.middleware");

// Pre-middleware
router.use(languageMiddleware);

// Define routes
router.post("/signup", authController.signup);
router.post("/verification", tokenMiddleware, authController.verify);
router.post("/resetPassword", tokenMiddleware, authController.resetPassword);
router.get("/refreshToken", tokenMiddleware, authController.refreshToken);
router.get("/verify/resendOtp", tokenMiddleware, authController.resendOtp);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/login", authController.login);
router.post("/google/login", authController.googleLogin);

module.exports = router;
