require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
const owner_route = require("./Modules/Owner/route");
const customer_route = require("./Modules/Customer/route");
const signup_route = require("./Modules/Signup/route");
const login_route = require("./Modules/Login/route");

// create express instance
const app = express();

var url = process.env.URL;
var port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Router
app.use("/login", login_route);
app.use("/signup", signup_route);
app.use("/admin", owner_route);
app.use("/customer", customer_route);

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Database has been successfully connected");
    }
  }
);

// Listen on port
app.listen(port, function () {
  console.log("App listening at port:", port);
});
