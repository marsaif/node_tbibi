var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Reclamation = new Schema(
  {
    date: Date,
    description: String,
    patient: { type: Schema.Types.ObjectId, ref: "users" },
    doctor: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reclamations", Reclamation);
