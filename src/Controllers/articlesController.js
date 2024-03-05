const AppError = require("../Helpers/AppError");
const Article = require("../Models/articles");

const getAllArticles = async (req, res, next) => {
  try {
    const Articles = await Article.find();
    if (Articles.length === 0) {
      return next(new AppError("No Articles found!", 404));
    }
    res.send({ message: "All Articles retrieved successfully", Articles });
  } catch (error) {
    return next(error);
  }
};
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return next(new AppError("Article not found", 404));
    }
    res.send({ message: "Article retrieved successfully", article });
  } catch (error) {
    return next(error);
  }
};
const createArticle = async (req, res, next) => {
  try {
    const { title, description, userName } = req.body;
    if (!title)
      return next(new AppError("Please enter the article description!"));
    const article = new Article({
      title: title.toLowerCase(),
      description,
      userName: userName.toLowerCase(),
      publishDate: new Date(),
    });
    await article.save();
    res.send({ message: "Article created successfully", article });
  } catch (error) {
    return next(error);
  }
};
const updateArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError("this article does not exist"));
    const newArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send({ message: "Article updated successfully", newArticle });
  } catch (err) {
    return next(err);
  }
};
const deleteArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError("this article does not exist"));
    const deleted = await Article.findByIdAndDelete(req.params.id);
    res.send({ message: "Article deleted successfully", deleted });
  } catch (err) {
    return next(err);
  }
};

const likeArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return next(new AppError("Article not found", 404));
    }
    const userName = req.body.userName;
    const isLiked = article.likedBy.find((name) => name === userName);
    if (!isLiked) {
      article.likedBy.push(userName);
      article.likes += 1;
    } else {
      article.likedBy = article.likedBy.filter((name) => name != userName);
      article.likes -= 1;
    }
    await article.save();
    res.send({ message: "Article liked successfully", article });
  } catch (error) {
    return next(error);
  }
};
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, userName } = req.body;
    const article = await Article.findById(id);
    if (!description)
      return next(new AppError("Please enter the Comment description!"));
    const comment = {
      description,
      userName: userName.toLowerCase(),
      publishDate: new Date(),
    };
    article.comments.push(comment);
    await article.save();
    res.send({ message: "Comment created successfully", article });
  } catch (error) {
    return next(error);
  }
};
const updateCommentById = async (req, res, next) => {
  try {
    const { id, commentid } = req.params;
    const { description, userName } = req.body;
    const article = await Article.findById(id);
    if (!description)
      return next(new AppError("Please enter the Comment description!"));
    const editedComment = {
      description,
      userName: userName.toLowerCase(),
      publishDate: new Date(),
    };

    const commentIndex = article.comments.findIndex(
      (comment) => comment._id.toString() === commentid
    );
    if (commentIndex === -1) {
      return next(new AppError("Comment not found", 404));
    }
    article.comments[commentIndex] = editedComment;

    await article.save();
    res.send({ message: "Comment edited successfully", article });
  } catch (error) {
    return next(error);
  }
};
const deleteCommentById = async (req, res, next) => {
  try {
    const { id, commentid } = req.params;
    const article = await Article.findById(id);
    if (!article) return next(new AppError("this article does not exist"));

    const commentIndex = article.comments.findIndex(
      (comment) => comment._id.toString() === commentid
    );
    if (commentIndex === -1) {
      return next(new AppError("Comment not found", 404));
    }
    article.comments.splice(commentIndex, 1);

    await article.save();
    res.send({ message: "Comment deleted successfully", article });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  updateArticleById,
  createArticle,
  deleteArticleById,
  likeArticleById,
  createComment,
  deleteCommentById,
  updateCommentById,
};
