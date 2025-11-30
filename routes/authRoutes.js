const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.renderLogin);
router.get("/signup", authController.renderSignup);
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

module.exports = router;
