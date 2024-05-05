const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/Helpers/socket.js");
require("./db.js");

const articlesRoute = require("./src/Routes/articlesRoute.js");
const userRoutes = require("./src/Routes/userRoutes.js");
//User have to be Logged In!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const verifyToken = require("./src/Helpers/tokenAuth.js");
// const path = require("path");

// Server Initialization
const app = express();
const PORT = process.env.PORT; //3000

// Middlewares
app.use(express.json());
// app.use(express.urlencoded());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes will be written here
app.use("/users", userRoutes);

app.use("/articles", verifyToken, articlesRoute); //User have to be Logged In!!!!!!!!!!

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

// Server Listen Along with Database
app.listen(PORT, (error) => {
  if (!error) console.log("Server is Running, and listening on port " + PORT);
  else console.log("Error occurred, server can't start", error);
});
