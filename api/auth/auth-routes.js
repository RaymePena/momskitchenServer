const express = require("express");
const router = express.Router();
const authController = require("./auth-controller");

router.post("/auth", authController.index);

module.exports = router;
