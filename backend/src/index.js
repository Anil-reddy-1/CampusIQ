const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db.js");
const { connectRedis, disconnectRedis } = require("./config/redis.js");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler.js");
const { requestLogger } = require("./middleware/requestLogger.js");
const { success } = require("./utils/response.js");
const logger = require("./utils/logger.js");
const userRoutes = require("./routes/user.routes.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());

// Request / Response logging (must be before routes)
app.use(requestLogger);

// Routes
app.use("/api/users", userRoutes);

// Root Health / DB Connection Test
app.get("/", async (req, res) => {
  const result = await pool.query("select current_database()");
  return success(res, {
    message: `Connected to database: ${result.rows[0].current_database}`,
    data: { database: result.rows[0].current_database },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

process.on("SIGINT", async () => {
  logger.info("SIGINT received — shutting down gracefully");
  await disconnectRedis();
  process.exit(0);
});

const { initializeTables } = require("./models/createTables.js");

// Server running
app.listen(port, async () => {
  logger.info(`Server running on port ${port}`);
  await connectRedis();
  try {
    await initializeTables();
  } catch (error) {
    logger.error("Failed to initialize database tables:", error);
  }
});

module.exports = app;
