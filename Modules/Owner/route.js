const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { verify } = require("../../Utilities/tokenGeneratorVerification");

router.post("/addproduct", verify, controller.add_product);
router.get("/getorders",verify,controller.view_orders)

module.exports = router;
