const express = require("express");
const {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
  likeArticleById,
  createComment,
  deleteCommentById,
  updateCommentById,
} = require("../Controllers/articlesController");

const routers = express.Router();

/////////////get methods////////////
routers.get("/", getAllArticles);
routers.get("/:id", getArticleById);

routers.post("/", createArticle);
routers.post("/like/:id", likeArticleById);
routers.post("/comment/:id", createComment);

routers.patch("/:id", updateArticleById);
routers.patch("/comment/:id/:commentid", updateCommentById);

routers.delete("/:id", deleteArticleById);
routers.delete("/comment/:id/:commentid", deleteCommentById);

routers.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "internal server error",
    errors: err?.errors || [],
  });
});

module.exports = routers;
