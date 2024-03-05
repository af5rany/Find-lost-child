const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      description: {
        type: String,
        required: true,
      },
      publishDate: {
        type: Date,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
