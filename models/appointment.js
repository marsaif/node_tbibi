var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Appointment = new Schema({
  DateAppointment: { type: Date, required: true },
  patient: { type: Schema.Types.ObjectId, ref: "users" },
  doctor: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("appointments", Appointment);
