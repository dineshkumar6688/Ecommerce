require("dotenv").config();
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

require("./user_schema");
require("./user_details_schema");

const Register = mongoose.model("user_register");
const Details = mongoose.model("user_details");

exports.add_user = async (req, res) => {
  Register.find({ user_mail: req.body.user_mail })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          success: false,
          message: "Mail already exists!",
        });
      } else {
        bcrypt.hash(req.body.user_password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: err,
            });
          } else {
            var newUser = {
              user_mail: req.body.user_mail,
              user_password: hash,
              user_role: req.body.user_role,
            };

            var user = new Register(newUser);

            user.save().then((data) => {
              var userDetails = {
                _id: new Object(data._id),
                user_name: req.body.user_mail,
                user_mail: req.body.user_mail,
                user_phoneno: req.body.user_phoneno,
              };

              var details = new Details(userDetails);
              details.save().then(() => {
                res.status(200).json({
                  success: true,
                  message: "Account created Successfully!!",
                });
              });
            });
          }
        });
      }
    });
};
