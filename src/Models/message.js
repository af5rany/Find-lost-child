const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  message: { type: String },
  room: { type: String },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dateTime: { type: Date },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
