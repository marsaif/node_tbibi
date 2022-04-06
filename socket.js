var express = require("express");
var cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/user");
const Conversation = require("./models/conversation");

var app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3006",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiverId, content } = data;
    console.log(data);
    const receiverUser = await User.findOne({ _id: receiverId }).exec();
    const user = await User.findOne({ _id: sender }).exec();
    const { role } = user;
    const message = {
      content: content,
      sender: user,
    };

    if (role == "DOCTOR") {
      let conversation = await Conversation.findOne({
        doctor: user,
        patient: receiverUser,
      }).exec();
      if (!conversation) {
        conversation = new Conversation({
          patient: receiverUser,
          doctor: user,
          messages: [],
        });
      }
      conversation.messages.push(message);
      conversation.save();
    } else {
      let conversation = await Conversation.findOne({
        doctor: receiverUser,
        patient: user,
      }).exec();
      console.log(conversation);
      if (!conversation) {
        conversation = new Conversation({
          doctor: receiverUser,
          patient: user,
          messages: [],
        });
      }

      conversation.messages.push(message);
      conversation.save();
    }

    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("user_typing", (data) => {
    socket.to(data.room).emit("receive_typing", data);
  });

  // video chat socket

  socket.on("callUser", (data) => {
    socket
      .to(data.userToCall)
      .emit("hey", { signal: data.signalData, from: data.from });
  });

  socket.on("acceptCall", (data) => {
    socket.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3002, () => {
  console.log("SERVER RUNNING");
});

module.exports = server;
