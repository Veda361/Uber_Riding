const express = require("express");
const cors = require("cors");

const userRoutes = require("./route/userRoute");
const rideRoutes = require("./route/rideRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);

module.exports = app;