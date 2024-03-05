const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
