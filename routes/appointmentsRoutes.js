var express = require("express");
const res = require("express/lib/response");
const app = require("../app");
const Appointment = require("../models/appointment");
const passport = require('passport');
var router = express.Router();

// router.get("/", function (req, res, next) {
//   Appointment.find({}, function (err, appointments) {
//     res.send(appointments);
//   });
// });
router.get("/",
    passport.authenticate('jwt', {session: false}), async (req, res) => {
        await Appointment.find({doctor: user})
            .sort({createdAt: -1})
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
            });
    });

router.delete("/:id", async function (req, res) {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    // await Appointment.find()
    //   .sort({ createdAt: -1 })
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    res.send(deletedAppointment);
});

router.post("/", passport.authenticate('jwt', {session: false}), async function (req, res) {
    const doctor=req.user
    const appointment = new Appointment({...req.body});
appointment.doctor=doctor
    appointment.DateAppointment.setHours(appointment.DateAppointment.getHours()+1)
    appointment.DateAppointment.setSeconds(0)

    await appointment
        .save()
        .then(() => {
            res.status(201).send(appointment);
        })
        .catch((error) => {
            console.log(error);
            res.send("choose other date");
        });
});

router.put("/", function (req, res, next) {
    id = req.body.id;
    Appointment.findByIdAndUpdate(id, {DateAppointment: "foo"}, (err, data) => {
        res.send("data updated");
    });
});

module.exports = router;
