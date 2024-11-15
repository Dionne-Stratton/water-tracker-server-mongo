const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema({
  measurement: String,
  timestamp: Date,
  amount: Number,
});

mongoose.model("Tracker", trackerSchema);
