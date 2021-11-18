const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { verify } = require("../../Utilities/tokenGeneratorVerification");

router.get("/getproducts", verify, controller.get_products);
router.get("/getbyname", verify, controller.get_by_name);
router.get("/getbycategory", verify, controller.get_by_category);
router.post("/addorder", verify, controller.order_product);
router.get("/vieworders", verify, controller.view_order);

module.exports = router;
