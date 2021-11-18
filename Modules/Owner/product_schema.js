const mongoose = require("mongoose");

mongoose.model("product", {
  product_category: {
    type: String,
  },
  product_name: {
    type: String,
    required: true,
    unique: true,
  },
  product_price: {
    type: Number,
  },
  product_quantity: {
    type: Number,
  },
  product_desc: {
    type: String,
  },
});
