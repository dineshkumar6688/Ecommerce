const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { verify } = require("../../Utilities/tokenGeneratorVerification");

router.post("/", controller.user_login);

module.exports = router;
