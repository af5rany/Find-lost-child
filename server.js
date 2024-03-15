const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
require("./db.js");

const articlesRoute = require("./src/Routes/articlesRoute.js");
const userRoutes = require("./src/Routes/userRoutes.js");
const messageRoute = require("./src/Routes/messageRoute.js");
//User have to be Logged In!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const verifyToken = require("./src/Helpers/tokenAuth.js");
// const path = require("path");

// Server Initialization
const app = express();
const PORT = process.env.PORT; //3000
const server = createServer(app);
const io = new Server(server);
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(
//   "/socket.io",
//   express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
// );

// Middlewares
app.use(express.json());
// app.use(express.urlencoded());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log("a user connected");

  // Event for receiving a message
  socket.on("sendMessage", (message) => {
    // Broadcast the message to all connected clients
    io.emit("receiveMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// Routes will be written here
app.use("/users", userRoutes);

app.use("/messages", messageRoute);

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
