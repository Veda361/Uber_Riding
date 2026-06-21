const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const {
  requestRide,
  acceptRide,
  startRide,
  completeRide,
  getDriverRides,
  getMyRides,
  getRideLocation,
} = require("../controllers/rideController");

const { requestRideValidation } = require("../validators/rideValidator");

router.post("/request", protect, requestRideValidation, validate, requestRide);

router.put("/:id/accept", protect, acceptRide);

router.put("/:id/start", protect, startRide);

router.put("/:id/complete", protect, completeRide);

router.get("/my-rides", protect, getMyRides);

router.get("/driver/my-rides", protect, getDriverRides);

router.get("/:id/location", protect, getRideLocation);

module.exports = router;
