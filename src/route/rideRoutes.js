const express = require("express");

const router = express.Router();

const {
  requestRide,
} = require("../controllers/rideController");

const protect = require("../middlewares/authMiddleware");

router.post("/request", protect, requestRide);

module.exports = router;