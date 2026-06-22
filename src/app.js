const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./route/userRoute");
const rideRoutes = require("./route/rideRoutes");
const driverRoutes = require("./route/driverRoutes");
const reviewRoutes = require("./route/reviewRoutes");
const notificationRoutes = require("./route/notificationRoutes");
const paymentRoutes = require("./route/paymentRoute");

const app = express();

// Security Middleware
app.use(helmet());

// MongoDB Sanitization
app.use(mongoSanitize());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

// Apply limiter only to API routes
app.use("/api", limiter);

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);


module.exports = app;