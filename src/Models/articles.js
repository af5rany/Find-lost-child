const mongoose = require("mongoose");
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  // likedBy: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  likedBy: [String],
  comments: [
    {
      description: {
        type: String,
        required: true,
      },
      publishDate: {
        type: Date,
      },
      userName: {
        type: String,
        required: true,
      },
    },
  ],
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
