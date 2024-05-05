const express = require("express");
const {
  getAllMessages,
  addNewMessages,
} = require("../Controllers/messageController");
const io = require("./../Helpers/socket");

const router = express.Router();

router.post("/", (req, res) => {
  const { sender, receiver, message } = req.body;

  // Emit joinRoom event for both sender and receiver
  io.to(`room_${sender}`).emit("joinRoom", receiver);
  io.to(`room_${receiver}`).emit("joinRoom", sender);

  // Send the message to the appropriate room
  io.to(`room_${receiver}`).emit("sendMessage", {
    room: `room_${receiver}`,
    message,
  });

  res.send("Message sent successfully");
});
router.get("/", getAllMessages);
router.post("/", addNewMessages);

module.exports = router;
