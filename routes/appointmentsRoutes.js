var express = require("express");
const res = require("express/lib/response");
const app = require("../app");
const Appointment = require("../models/appointment");
var router = express.Router();

// router.get("/", function (req, res, next) {
//   Appointment.find({}, function (err, appointments) {
//     res.send(appointments);
//   });
// });
router.get("/", async (req, res) => {
  await Appointment.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", async function (req, res) {
  const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
  res.send(deletedAppointment);
});

router.post("/", async function (req, res) {
  const appointment = new Appointment({ ...req.body });
  await appointment.save()
  .then(()=>{
     res.status(201).send(appointment);
  })
  .catch((error)=>{
    console.log(error)
  })
 
});

router.put("/", function (req, res, next) {
  id = req.body.id;
  Appointment.findByIdAndUpdate(id, { DateAppointment: "foo" }, (err, data) => {
    res.send("data updated");
  });
});

module.exports = router;
