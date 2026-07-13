const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
  if (!MONGO_URI) {
    console.warn("MONGO_URI is not set. Skipping MongoDB connection.");
    return;
  }

  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Mongoose Connected");
    })
    .catch((err) => {
      console.error("Mongoose connection failed:", err);
      console.warn("Continuing without MongoDB connection.");
    });
};

module.exports = connectDatabase;
