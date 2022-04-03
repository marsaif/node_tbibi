
var express = require('express');
var cors = require('cors')
const { Server } = require("socket.io");
const http = require("http");

var app = express();
app.use(cors())


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("user_typing", (data) => {
    socket.to(data.room).emit("receive_typing", data);
  });



  // video chat socket 

  socket.on("callUser", (data) => {
    socket.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  })

  socket.on("acceptCall", (data) => {
    socket.to(data.to).emit('callAccepted', data.signal);
  })


  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3002, () => {
  console.log("SERVER RUNNING");
});

module.exports = server ; 