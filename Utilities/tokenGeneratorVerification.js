require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateAccessToken(eid) {
  return jwt.sign(
    {
      user_mail: eid,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1hr",
    }
  );
}

function verify(req, res, next) {
  try {
    const auth_status = jwt.verify(
      req.header("Authorization").split(" ")[1],
      process.env.JWT_KEY
    );
    res.locals.user_mail = auth_status.user_mail;
    next();
  } catch (err) {
    res.status(409).json({
      success: false,
      message: "Authentication Failed!",
    });
  }
}

module.exports = {
  generateAccessToken,
  verify,
};
