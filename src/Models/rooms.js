const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  helper: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
