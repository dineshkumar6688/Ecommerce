const mongoose = require("mongoose");

require("../Signup/user_details_schema");
require("../Owner/order_schema");

const User = mongoose.model("user_details");
const Product = mongoose.model("product");
const Order = mongoose.model("order");

exports.get_products = (req, res) => {
  Product.find({}).then((product) => {
    if (product.length < 1) {
      res.status(409).json({
        success: false,
        message: "No records found!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: product,
      });
    }
  });
};

exports.get_by_name = (req, res) => {
  Product.find({ product_name: req.query.product_name }).then((product) => {
    if (product.length < 1) {
      res.status(409).json({
        success: false,
        message: "No records found!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: product,
      });
    }
  });
};

exports.get_by_category = (req, res) => {
  Product.find({ product_category: req.query.product_category }).then(
    (product) => {
      if (product.length < 1) {
        res.status(409).json({
          success: false,
          message: "No records found!",
        });
      } else {
        res.status(200).json({
          success: true,
          message: product,
        });
      }
    }
  );
};

exports.order_product = (req, res) => {
  Product.findById({ _id: req.body.products.product_id })
    .exec()
    .then(async (product) => {
      if (product.length < 1) {
        res.status(409).json({
          success: false,
          message: "Product does not exists!",
        });
      } else {
        if (product.product_quantity >= req.body.products.order_quantity) {
          var newOrder = {
            customer_id: req.body.customer_id,
            products: {
              product_id: req.body.products.product_id,
              order_quantity: req.body.products.order_quantity,
            },
          };
          var order = new Order(newOrder);
          await Product.findByIdAndUpdate(
            { _id: req.body.products.product_id },
            {
              product_quantity:
                product.product_quantity - req.body.products.order_quantity,
            }
          );
          order.save().then(async (data) => {
            await User.findByIdAndUpdate(
              { _id: req.body.customer_id },
              { $push: { orderId: new Object(data._id) } }
            );
            res.status(200).json({
              success: true,
              message: "Order has been placed Successfully!!",
            });
          });
        } else if (product.product_quantity == 0) {
          res.status(400).json({
            success: false,
            message: "Order has not been placed. Not Stock left!!",
          });
        } else {
          res.status(409).json({
            success: false,
            message:
              "Enter less quantity." +
              "The available quantity is " +
              product.product_quantity,
          });
        }
      }
    });
};

exports.view_order = async (req, res) => {
  // var response = {
  //   userData: "",
  //   productData: { productDetails: "", orderQuantity: null },
  // };
  // await User.find({ user_mail: req.query.user_mail }).then((userData) => {
  //   response.userData = userData;
  //   userData[0].orderId.forEach(async (id) => {
  //     await Order.findById({ _id: id }).then(async (data) => {
  //       response.productData.orderQuantity = data.order_quantity;
  //       await Product.findById({ _id: data.products.product_id }).then(
  //         (productData) => {
  //           response.productData.productDetails = productData;
  //         }
  //       );
  //     });
  //   });
  // });
  User.aggregate([
    {
      $match: {
        user_mail: req.query.user_mail,
      },
    },
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
        as: "orderId.products",
      },
    },
  ]).then((data) =>
    res.status(200).json({
      success: true,
      message: data,
    })
  );
  // res.status(200).json({
  //   success: true,
  //   message: response,
  // });
};
