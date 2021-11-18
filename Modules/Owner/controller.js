const mongoose = require("mongoose");

require("./order_schema");
require("./product_schema");

const Product = mongoose.model("product");
const Order = mongoose.model("order");

exports.add_product = (req, res) => {
  Product.find({ product_name: req.body.product_name })
    .exec()
    .then((product) => {
      if (product.length >= 1) {
        res.status(409).json({
          success: false,
          message: "Product already exists!",
        });
      } else {
        var newProduct = {
          product_category: req.body.product_category,
          product_name: req.body.product_name,
          product_price: req.body.product_price,
          product_quantity: req.body.product_quantity,
          product_desc: req.body.product_desc,
        };

        var product = new Product(newProduct);

        product.save().then(() => {
          res.status(200).json({
            success: true,
            message: "Product has been created Successfully!!",
          });
        });
      }
    });
};

exports.view_orders = (req, res) => {
  Order.find({}).then(async (order) => {
    if (order.length < 1) {
      res.status(409).json({
        success: false,
        message: "No orders found!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: order,
      });
    }
  });
};
