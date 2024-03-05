const AppError = require("../Helpers/AppError");
const Post = require("../Models/posts");

const createComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return next(new AppError("sorry this post no longer exists :("));
    const { description } = req.body;
    if (!description) return next(new AppError("please enter your comment"));
    const userId = req.id; // Access the authenticated user ID from req.body
    const comment = { description, publishDate: Date.now(), userId };
    post.comments.push(comment);
    await post.save();
    res.send(post);
  } catch (err) {
    return next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const postId = req.params.postid;
    const commentId = req.params.commentid;
    const post = await Post.findById(postId);
    if (!post) return next(new AppError("post no longer exists :("));
    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) return next(new AppError("comment no longer exists :("));
    const userId = comment.userId;
    if (userId == req.id) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, "comments._id": commentId },
        {
          $set: {
            "comments.$.description": req.body.description,
            "comments.$.publishDate": Date.now(),
            // Add more fields to update as needed
          },
        },
        { new: true }
      );
      res.send({ message: "Comment updated successfully", updatedPost });
    } else {
      res.send({ message: "you cannot edit other users comments" });
    }
  } catch (error) {
    return next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const postId = req.params.postid;
    const commentId = req.params.commentid;

    const post = await Post.findById(postId);

    if (!post) {
      return next(new AppError("Post no longer exists :("));
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) return next(new AppError("comment no longer exists :("));

    const userId = comment.userId;

    if (userId == req.id || req.authorizedUser.role == "admin") {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );

      res.send({ message: "Comment deleted successfully", updatedPost });
    } else {
      return next(
        new AppError("You are not authorized to delete this comment")
      );
    }
  } catch (error) {
    return next(error);
  }
};
module.exports = { createComment, updateComment, deleteComment };
