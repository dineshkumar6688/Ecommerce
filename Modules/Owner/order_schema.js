const mongoose = require("mongoose");

mongoose.model("order", {
  customer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  products: {
    product_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    order_quantity: {
      type: Number,
      required: true,
    },
  },
});
