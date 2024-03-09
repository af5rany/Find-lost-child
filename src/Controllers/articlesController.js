const AppError = require("../Helpers/AppError");
const Article = require("../Models/articles");

const getAllArticles = async (req, res, next) => {
  try {
    const Articles = await Article.find();
    if (Articles.length === 0) {
      return next(new AppError("No Articles found!", 404));
    }
    res.send(Articles);
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
    res.send(article);
  } catch (error) {
    return next(error);
  }
};
const createArticle = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userName = req.user.userName;
    if (!title)
      return next(new AppError("Please enter the article description!"));
    const article = new Article({
      title: title.toLowerCase(),
      description,
      userName: userName.toLowerCase(),
      publishDate: new Date(),
    });
    await article.save();
    res.send(article);
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
    res.send({ message: "Article deleted successfully" });
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
    const userName = req.user.userName;
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
    const article = await Article.findById(id);
    if (!article)
      return next(new AppError("sorry this article no longer exists"));
    const { description } = req.body;
    if (!description) return next(new AppError("Please enter a Comment!"));
    const userName = req.user.userName;
    const comment = {
      description,
      userName: userName.toLowerCase(),
      publishDate: new Date(),
    };
    article.comments.push(comment);
    await article.save();
    res.send(article);
  } catch (error) {
    return next(error);
  }
};
const updateCommentById = async (req, res, next) => {
  try {
    const { id, commentid } = req.params;
    const article = await Article.findById(id);
    if (!article)
      return next(new AppError("sorry this article no longer exists"));
    const { description } = req.body;
    if (!description)
      return next(new AppError("Please enter the Comment description!"));
    const userName = req.user.userName;
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
    res.send(article);
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
