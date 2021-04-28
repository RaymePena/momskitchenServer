const express = require("express");
const router = express.Router();
const userController = require("./user-controller");

router.post("/user", userController.index);

module.exports = router;
