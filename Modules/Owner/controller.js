const mongoose = require("mongoose");

require("./product_schema");
require("../Signup/user_details_schema")

const Product = mongoose.model("product");
const User = mongoose.model("user_details");

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
  User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "orderId",
      },
    },
    {
      $project: {
        "orderId._id": 0,
        "orderId.customer_id": 0,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "orderId.products.product_id",
        foreignField: "_id",
        as: "products",
      },
    },
  ]).then((data) =>
    res.status(200).json({
      success: true,
      message: data,
    })
  );
};
