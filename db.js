const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
}
