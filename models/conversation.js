const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let conversation = new Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [
    {
      content: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdDate: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("conversations", conversation);
