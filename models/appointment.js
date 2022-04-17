var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Appointment = new Schema(
  {
    DateAppointment: { type: Date, required: true, unique: true },
    patientName: { type: String },
    patientAge: { type: Number },
    patientPhone: { type: String },
    gender: { type: String },
    doctor: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointments", Appointment);
