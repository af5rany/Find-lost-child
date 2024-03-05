const Post = require("../Models/posts");
const User = require("../Models/Users");
const AppError = require("../Helpers/AppError");
const Review = require("../Models/reviewModel");

/////////////get methods////////////////

//http://localhost:8080/posts/

// const getAllPosts = async (req, res, next) => {
//   try {
//     const posts = await Post.find();
//     if (posts.length == 0) return next(new AppError("no posts found!"));
//     res.send({ message: "All posts retrieved successfully", posts });
//   } catch (error) {
//     return next(error);
//   }
// };
const getAllPosts = async (req, res, next) => {
  try {
    // const posts = await Post.find();
    const posts = await Post.find().populate("reviews");

    if (posts.length === 0) {
      return next(new AppError("No posts found!", 404));
    }

    // for (const post of posts) {
    //   const reviews = await Review.find({ postId: post._id });
    //   post.reviews = reviews;
    // }

    res.send({ message: "All posts retrieved successfully", posts });
  } catch (error) {
    return next(error);
  }
};

//http://localhost:8080/posts/:id

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("reviews");

    // const post = await Post.findById(id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    // const reviews = await Review.find({ postId: id });

    // post.reviews = reviews;

    res.send({ message: "Post retrieved successfully", post });
  } catch (err) {
    return next(err);
  }
};

//http://localhost:8080/posts/user/:id

// const getAllPostsByUser = async (req, res, next) => {
//   console.log(req.params.id);
//   const user = await User.findById(req.params.id);
//   if (!user) return next(new AppError("user does not exist"));
//   const posts = await Post.find({ userId: req.params.id });
//   if (posts.length == 0) return next(new AppError("no posts found!"));
//   res.send({ message: "All posts retrieved successfully", posts });
// };
const getAllPostsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User does not exist", 404));
    }

    const posts = await Post.find({ userId: id }).populate("reviews");
    if (posts.length === 0) {
      return next(new AppError("No posts found!", 404));
    }

    // for (const post of posts) {
    //   const reviews = await Review.find({ postId: post._id });
    //   post.reviews = reviews;
    // }

    res.send({ message: "All posts retrieved successfully", posts });
  } catch (err) {
    return next(err);
  }
};

//http://localhost:8080/posts/userposts

// const getAllPostsByLoggedInUser = async (req, res, next) => {
//   try {
//     const posts = await Post.find({ userId: req.id });
//     if (posts.length == 0) return next(new AppError("no posts found!"));
//     res.send({ message: "All posts retrieved successfully", posts });
//   } catch (err) {
//     return next(err);
//   }
// };
const getAllPostsByLoggedInUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.id }).populate("reviews");
    if (posts.length === 0) {
      return next(new AppError("No posts found!", 404));
    }

    // for (const post of posts) {
    //   const reviews = await Review.find({ postId: post._id });
    //   post.reviews = reviews;
    // }

    res.send({ message: "All posts retrieved successfully", posts });
  } catch (err) {
    return next(err);
  }
};

//http://localhost:8080/postId/comments

const getAllCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const comments = post.comments;
    if (comments.length == 0)
      return next(new AppError("no comments yet on this post"));
    res.send({ message: "All comments retrieved successfully", comments });
  } catch (err) {
    return next(err);
  }
};

/////////////post methods////////////////

//http://localhost:8080/posts

const createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.id;
    if (!title) return next(new AppError("Please enter the post content!"));
    const post = new Post({ title, userId, publishDate: new Date() });
    await post.save();
    const user = req.authorizedUser;
    user.postId.push(post.id);
    await req.authorizedUser.save();
    res.send({ message: "Post created successfully", post });
  } catch (error) {
    return next(error);
  }
};

/////////////patch methods////////////////

//http://localhost:8080/posts/:id

const updatePostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new AppError("this post does not exist"));
    if (req.authorizedUser.id == post.userId) {
      const newpost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.send({ message: "Post updated successfully", newpost });
    } else {
      res.send({ message: "you can't edit other users posts" });
    }
  } catch (err) {
    return next(err);
  }
};

/////////////delete methods////////////////

//http://localhost:8080/posts/:id

const deletePostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new AppError("post does not exist"));
    if (
      req.authorizedUser.id == post.userId ||
      req.authorizedUser.role == "admin"
    ) {
      await Post.findByIdAndDelete(req.params.id);
      const postId = req.params.id;
      await Review.deleteMany({ postId });

      // console.log(reviews);

      res.send({ message: "Post deleted successfully" });
    } else {
      res.send({ message: "you can't delete other users posts" });
    }
  } catch (err) {
    return next(err);
  }
};

//http://localhost:8080/posts

const deleteAllPosts = async (req, res, next) => {
  try {
    await Post.deleteMany({ userId: req.id });
    res.send({ message: "All posts deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

//http://localhost:8080/posts/user/:id

const deleteAllPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await Post.deleteMany({ userId });
    // await Review.deleteMany({ postId });

    res.send({ message: "All posts deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  deleteAllPosts,
  getAllPostsByUser,
  deleteAllPostsByUser,
  getAllCommentsByPost,
  getAllPostsByLoggedInUser,
};
