var express = require("express");
var router = express.Router();
const Appointment = require("../models/apptest");
const Conversation = require("../models/conversation");
const User = require("../models/user");
const passport = require("passport");

// this function is add a new conversation
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    const { message, receiver } = req.body;
    const { role } = req.user;
    const receiverUser = await User.findOne({ _id: receiver }).exec();
    console.log(receiverUser);
    const data = {
      content: message,
      sender: req.user,
    };

    if (role == "DOCTOR") {
      let conversation = await Conversation.findOne({
        doctor: req.user,
        patient: receiverUser,
      }).exec();
      if (!conversation) {
        conversation = new Conversation({
          patient: receiverUser,
          doctor: req.user,
          messages: [],
        });
      }
      conversation.messages.push(data);
      conversation.save();
    } else {
      console.log("tes");
      let conversation = await Conversation.findOne({
        doctor: receiverUser,
        patient: req.user,
      }).exec();
      console.log(conversation);
      if (!conversation) {
        conversation = new Conversation({
          doctor: receiverUser,
          patient: req.user,
          messages: [],
        });
        conversation.messages.push(data);
        conversation.save();
      }
    }
    return res.send("conversation saved");
  }
);

// get the conversation of user
router.get(
  "/conv/:otherUserId",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    const { otherUserId } = req.params;
    const { role } = req.user;
    const otherUser = await User.findById({ _id: otherUserId }).exec();

    if (role == "DOCTOR") {
      const conversation = await Conversation.findOne({
        doctor: req.user,
        patient: otherUser,
      }).exec();
      return res.json({ conversation: conversation });
    } else {
      const conversation = await Conversation.findOne({
        doctor: otherUser,
        patient: req.user,
      }).exec();
      return res.json({ conversation: conversation });
    }
  }
);

// get the last message of each conversation of all contacts
router.get(
  "/lastconv",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      if (req.user.role == "DOCTOR") {
        let result = [];
        for await (const appointment of Appointment.find({
          doctor: req.user,
        })) {
          let patient_id = appointment.patient;
          let patient = await User.findById({ _id: patient_id });
          let conversation = await Conversation.findOne({
            doctor: req.user,
            patient: patient,
          });
          let lastConversation =
            conversation.messages[conversation.messages.length - 1];
          result.push({ user: patient, lastConversation: lastConversation });
        }
        res.json({ result: result });
      } else {
        let result = [];
        for await (const appointment of Appointment.find({
          patient: req.user,
        })) {
          let doctor_id = appointment.doctor;
          let doctor = await User.findById({ _id: doctor_id });
          let conversation = await Conversation.findOne({
            patient: req.user,
            doctor: doctor,
          });
          let lastConversation =
            conversation.messages[conversation.messages.length - 1];
          result.push({ user: doctor, lastConversation: lastConversation });
        }
        res.json({ result: result });
      }
    } catch (error) {
      res.send(error);
    }
  }
);

module.exports = router;
