const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  topFiveRatedPosts,
} = require("../Controllers/reviewController");
const router = express.Router();

router.get("/topfive", topFiveRatedPosts);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
