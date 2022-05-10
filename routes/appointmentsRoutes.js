var express = require("express");
const res = require("express/lib/response");
const app = require("../app");
const Appointment = require("../models/appointment");
const passport = require("passport");
const schedule = require("node-schedule");
const axios = require("axios");
var router = express.Router();
const user = require("../models/user");

const getDoctor = async (id) => {
  const doctor = await user.findById(id);

  return doctor.firstName;
};

const job = schedule.scheduleJob("0 10 * * *", async function () {
  const today = new Date();
  today.setHours(today.getHours() + 1);

  today.setSeconds(0);
  today.setMilliseconds(0);
  let diffHours;

  Appointment.find()
    .then((res) => {
      if (!res || res.length === 0) {
        console.log("there is no appointments");
      } else {
        console.log("working ");

        res.forEach(async (item, index, array) => {
          diffHours = Math.ceil((item.DateAppointment - today) / (60000 * 60));
          if (diffHours > 20 && diffHours < 34) {
            const doctorId = item.doctor;
            const number = item.patientPhone;
            const PatientName = item.patientName;
            const date = item.DateAppointment;

            await getDoctor(doctorId).then((doctorName) => {
              let url = "";
              url = encodeURI(url);
              console.log("URL: " + url);
              axios
                .get(url)
                .then(() => {
                  console.log("sms send success");
                })
                .catch((err) => {
                  console.log("axios send message error", err.message);
                });
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log("get appointments error", err.message);
    });
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    if (user.role === "DOCTOR") {
      await Appointment.find({ doctor: user })
        .sort({ createdAt: -1 })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (user.role === "PATIENT") {
      await Appointment.find({ patient: user })
        .sort({ createdAt: -1 })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
);

router.delete("/:id", async function (req, res) {
  const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
  res.send(deletedAppointment);
});
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    console.log("req user ", req.user);
    console.log(req.body);
    const id = req.params.id;
    const patient = req.user;
    const doctor = await user.findById(id);
    const patientName = patient.firstName;

    const patientEmail = patient.email;
    const patientPhone = patient.phone;
    const gender = patient.sex;
    const appointment = new Appointment({ ...req.body });

    appointment.doctor = doctor;
    appointment.patient = patient;
    appointment.patientName = patientName;
    appointment.gender = gender;
    appointment.patientEmail = patientEmail;
    appointment.patientPhone = patientPhone;

    appointment.DateAppointment.setHours(
      appointment.DateAppointment.getHours() + 1
    );
    appointment.DateAppointment.setSeconds(0);
    await appointment
      .save()
      .then(() => {
        res.status(201).send(appointment);
      })
      .catch((error) => {
        res.status(204).send("choose other date");
      });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    console.log("req user ", req.user);

    const doctor = req.user;
    const appointment = new Appointment({ ...req.body });

    appointment.doctor = doctor;

    console.log("appointment to add", appointment);
    console.log(appointment.DateAppointment);
    // appointment.DateAppointment = appointment.DateAppointment.toLocaleString(
    //   "en-US",
    //   { timeZone: "Africa/Tunis" }
    // );
    appointment.DateAppointment.setHours(
      appointment.DateAppointment.getHours() + 1
    );
    appointment.DateAppointment.setSeconds(0);
    console.log(appointment.DateAppointment);
    await appointment
      .save()
      .then(() => {
        console.log(appointment.DateAppointment);
        res.status(201).send(appointment);
      })
      .catch((error) => {
        console.log(error.message);

        res.status(204).send("choose other date");
      });
  }
);

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const appointment = new Appointment({ ...req.body });
  console.log("aapointment", appointment);
  appointment.DateAppointment.setHours(
    appointment.DateAppointment.getHours() + 1
  );
  appointment.DateAppointment.setSeconds(0);
  const appointmentup = {
    DateAppointment: appointment.DateAppointment,
    patientName: appointment.patientName,
    patientEmail: appointment.patientEmail,
    patientAge: appointment.patientAge,
    patientPhone: appointment.patientPhone,
    gender: appointment.gender,
  };
  console.log("appointmentup:", appointmentup);

  Appointment.findByIdAndUpdate(id, appointmentup)
    .then((result) => {
      res.status(200).json({ message: " appointment  updated" });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(204).send("wrong date");
    });
});

module.exports = router;
