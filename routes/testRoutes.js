var express = require("express");
var router = express.Router();
const Appointment = require("../models/apptest");
const User = require("../models/user");

router.post("/", async function (req, res, next) {
  try {
    const doctor = await User.findById({ _id: req.body.doctor });
    const patient = await User.findById({ _id: req.body.patient });
    const date = new Date();

    const appointment = new Appointment({
      doctor: doctor,
      patient: patient,
      DateAppointment: date,
    });
    appointment.save();
    res.send("saved");
  } catch (error) {
    res.send(error);
  }
});

router.get("/:user_id", async function (req, res, next) {
  try {
    const user = await User.findById({ _id: req.params.user_id });
    if (user.role == "DOCTOR") {
      const appointments = await Appointment.find({ doctor: user })
        .populate("doctor")
        .populate("patient")
        .exec();

      res.json({ appointments: appointments });
    } else {
      const appointments = await Appointment.find({ patient: user })
        .populate("doctor")
        .populate("patient")
        .exec();
      res.json({ appointments: appointments });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
