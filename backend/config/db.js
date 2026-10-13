
const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoURI);

  console.log("MongoDB Connected Successfully");
  console.log(`Database: ${mongoose.connection.name}`);
};

module.exports = connectDB;
