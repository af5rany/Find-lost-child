const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UsersSchema = new Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
  },
  userName: {
    type: String,
    required: [true, "please enter a userName"],
  },
  name: {
    type: String,
    required: [true, "please enter yout name"],
  },
  role: {
    type: String,
    enum: ["parent", "guest"],
    required: [true, "please enter your role"],
  },
  phoneNumber: {
    type: String,
    required: [true, "please enter your Phone Number"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    selected: false,
  },
  // photo_url: [
  //   {
  //     type: String,
  //   },
  // ],
  // articleId: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Article",
  //   },
  // ],
});

UsersSchema.methods.savePassword = async function (password) {
  const hashed_password = await bcrypt.hash(password, 10);
  this.password = hashed_password;
  await this.save();
};

UsersSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("User", UsersSchema);

module.exports = User;
