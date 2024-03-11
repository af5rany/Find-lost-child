const express = require("express");
const {
  getAllMessages,
  addNewMessages,
} = require("../Controllers/messageController");
const router = express.Router();

router.get("/", getAllMessages);
router.post("/", addNewMessages);

module.exports = router;
