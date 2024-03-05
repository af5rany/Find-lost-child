const express = require("express");
require("dotenv").config();
require("./db.js");

// Local Modules

// Server Initialization
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());

// Routes will be written here
const articlesRoute = require("./src/Routes/articlesRoute.js");
app.use("/articles", articlesRoute);

// Server Listen Along with Database
// connection(in case of data persistence)
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
