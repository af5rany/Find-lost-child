const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
//socket initialization
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log(`${socket.id} joined!!`);

  // joining a chat room
  socket.on("match", (data) => {
    const { sender, receiver } = data;
    const roomName = [sender, receiver].sort().join("_");
    socket.join(roomName);
    // console.log(`${socket.id} joined room: ${roomName}`);
  });
  // Event for receiving a message
  socket.on("sendMessage", (data) => {
    const { sender, receiver, message } = data;
    const roomName = [sender, receiver].sort().join("_");
    io.to(roomName).emit("receiveMessage", { sender, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
// socket server  Listen  on port 4000
io.listen(4000);
