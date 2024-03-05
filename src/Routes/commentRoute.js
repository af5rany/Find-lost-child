const express = require("express");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../Controllers/commentController");
const routers = express.Router();


/////////////post methods////////////
routers.post('/:id', createComment)


/////////////patch methods////////////
routers.patch('/:postid/:commentid', updateComment)


/////////////delete methods////////////
routers.delete('/:postid/:commentid', deleteComment)


routers.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports = routers;
