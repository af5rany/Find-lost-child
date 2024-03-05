const express = require("express");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  deleteAllPosts,
  getAllPostsByUser,
  deleteAllPostsByUser,
  getAllCommentsByPost,
  getAllPostsByLoggedInUser
} = require("../Controllers/postController");
const verifyAdmin = require("../Helpers/verifyAdmin");
const routers = express.Router();


/////////////get methods////////////////
routers.get("/", getAllPosts);
routers.get("/userposts", getAllPostsByLoggedInUser);
routers.get("/:id", getPostById);
routers.get("/user/:id", getAllPostsByUser);
routers.get("/:postId/comments", getAllCommentsByPost);
// Add this line


/////////////post methods////////////////
routers.post("/", createPost);


/////////////patch methods////////////////
routers.patch("/:id", updatePostById);


/////////////delete methods////////////////
routers.delete("/:id",deletePostById);
routers.delete("/", deleteAllPosts);


/////////////Admin delete methods////////////////
routers.delete("/user/:userId",verifyAdmin,deleteAllPostsByUser);

routers.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports = routers;
