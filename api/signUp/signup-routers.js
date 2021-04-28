const express = require("express");
const router = express.Router();
const signupController = require("./signup-controller");

router.post("/sign-up", signupController.index);

module.exports = router;
