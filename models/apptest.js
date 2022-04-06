var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Apptest = new Schema({
  DateAppointment: { type: Date, required: true },
  patient: { type: Schema.Types.ObjectId, ref: "users" },
  doctor: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("apptest", Apptest);
