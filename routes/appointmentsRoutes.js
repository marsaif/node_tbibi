var express = require("express");
const res = require("express/lib/response");
const app = require("../app");
const Appointment = require("../models/appointment");
var router = express.Router();

router.get("/", function (req, res, next) {
  Appointment.find({}, function (err, appointments) {
    res.send(appointments);
  });
});

router.post("/", async function (req, res) {
  const appointment = new Appointment({ ...req.body });
  await appointment.save();
  res.status(201).send(appointment);
});

router.put("/", function (req, res, next) {
  id = req.body.id;
  Appointment.findByIdAndUpdate(id, { DateAppointment: "foo" }, (err, data) => {
    res.send("data updated");
  });
});

module.exports = router;
