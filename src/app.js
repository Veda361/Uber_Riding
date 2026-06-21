const express = require("express");
const cors = require("cors");

const userRoutes = require("./route/userRoute");
const rideRoutes = require("./route/rideRoutes");
const driverRoutes = require("./route/driverRoutes");
const reviewRoutes = require("./route/reviewRoutes");
const notificationRoutes = require("./route/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

// console.log(userRoutes);
// console.log(rideRoutes);
// console.log(driverRoutes);

app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/notifications", notificationRoutes);

module.exports = app;
