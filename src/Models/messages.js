const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  dateTime: { type: Date },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
