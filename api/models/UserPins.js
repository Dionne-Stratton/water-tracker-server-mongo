const mongoose = require("mongoose");

const userPinSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    unique: true,
    required: true,
  },
  //expires in 30 minutes
  expireAt: { type: Date, default: Date.now, expires: 1800 },
});

mongoose.model("UserPin", userPinSchema);
