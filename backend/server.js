
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cache the MongoDB connection for serverless invocations
let dbConnectionPromise;

const ensureDBConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  await dbConnectionPromise;
};

// Home route
app.get("/", async (req, res, next) => {
  try {
    await ensureDBConnection();

    res.status(200).json({
      success: true,
      message: "MERN Task Manager API is running!"
    });
  } catch (error) {
    next(error);
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Export the Express app for Vercel
module.exports = app;

// Start a local server only when running directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  ensureDBConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}
