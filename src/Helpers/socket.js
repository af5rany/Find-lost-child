const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const Room = require("../Models/rooms");
const User = require("../Models/Users");
const Message = require("../Models/message");

const app = express();
const server = createServer(app);
//socket initialization
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const usersList = [];
io.on("connection", (socket) => {
  // console.log("socckkeeet", socket.handshake.auth.name);
  // console.log(`${socket.id} joined!!`);
  usersList.push({ socketID: socket.id, userName: socket.handshake.auth.name });

  // joining a chat room
  socket.on("match", async (data) => {
    const { helperName, parentName } = data;
    const parentUser = await User.findOne({ username: helperName });
    const helperUser = await User.findOne({ username: parentName });

    if (!parentUser || !helperUser) {
      socket.emit("error", { message: "User not found" });
      return;
    }
    const room = new Room({
      parent: parentUser._id,
      helper: helperUser._id,
      // parent: helperName,
      // helper: parentName,
    });
    await room.save();

    // const roomName = [senderUser, receiverUser].sort().join("_"); //hammo_omar
    socket.join(room._id);
    // emit("roomName", { roomID: room._id });
    const parentSocketUser = usersList.find(
      (user) => user.userName == parentName
    );
    if (parentSocketUser?.socketID) {
      io.to(parentSocketUser?.socketID).emit("createRoom", {
        roomID: room._id,
      });
    }
    io.to(socket.id).emit("createRoom", { roomID: room._id });
    // io.broadcast.emit("roomName", { roomID: room._id });
    // console.log(`${socket.id} joined room: ${roomName}`);
  });

  socket.on("message", async (data) => {
    const { sender, roomID, message } = data;
    const text = new Message({
      sender: sender,
      room: roomID,
      message: message,
      dateTime: new Date(),
    });
    await text.save();
    io.broadcast.to(roomID).emit("message", { text });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
// socket server  Listen  on port 4000
io.listen(4000);
