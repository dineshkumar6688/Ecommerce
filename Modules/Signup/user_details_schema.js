const mongoose = require("mongoose");

mongoose.model("user_details", {
  user_name: {
    type: String,
    required: true,
  },
  user_mail: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  user_phoneno: {
    type: Number,
    required: true,
  },
  orderId: [{ type: mongoose.Types.ObjectId }],
});
