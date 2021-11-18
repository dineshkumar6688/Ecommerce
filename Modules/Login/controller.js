require("dotenv").config();
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  generateAccessToken,
} = require("../../Utilities/tokenGeneratorVerification");

const Register = mongoose.model("user_register");

exports.user_login = async (req, res, next) => {

  var token;
  Register.find({ user_mail: req.body.user_mail, user_role: req.body.user_role })
    .exec()
    .then(async (user) => {
      if (user.length < 1) {
        res.status(401).json({
          success: false,
          message: "User does not exist!",
        });
      } else {
        bcrypt.compare(
          req.body.user_password,
          user[0].user_password,
          (err, result) => {
            if (err) {
              res.status(401).json({
                success: false,
                message: err,
              });
            }
            if (result) {
              token = generateAccessToken(req.body.user_mail);
              res.status(200).json({
                success: true,
                message: "Successfully logged in!!",
                token: token,
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Password doesn't match",
              });
            }
          }
        );
      }
    });
};

exports.user_logout = (req, res) => {
  var date = moment().format("LL");
  var timing = moment().format("LLL");
  Signup.find({ emp_mail: req.body.emp_mail })
    .exec()
    .then(async (user) => {
      if (user.length < 1) {
        res.status(401).json({
          success: false,
          message: "User does not exist!",
        });
      } else {
        if (user[0].role != 0) {
          Signup.find({
            attendence: { $elemMatch: { date: date } },
          }).then((present) => {
            if (present.length > 0) {
              Signup.findOneAndUpdate(
                { emp_mail: req.body.emp_mail, "attendence.date": date },
                { $set: { "attendence.$.loggedOut": timing } }
              ).then(() => {
                res.status(200).json({
                  success: true,
                  message: "Successfully logged out!!",
                });
              });
            } else {
              res.status(200).json({
                success: true,
                message: "Not logged in this date!!",
              });
            }
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Successfully logged out!!",
          });
        }
      }
    });
};
