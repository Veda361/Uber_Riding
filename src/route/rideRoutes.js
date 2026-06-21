const express = require("express");

const router = express.Router();

const {
  requestRide,
  acceptRide,
  startRide,
  completeRide,
  getDriverRides,
  getMyRides,
} = require("../controllers/rideController");

const protect = require("../middlewares/authMiddleware");

router.post("/request", protect, requestRide);
router.put("/:id/accept", protect, acceptRide);
router.put("/:id/start", protect, startRide);
router.put("/:id/complete", protect, completeRide);
router.get("/my-rides", protect, getMyRides);
router.get("/diver/my-rides", protect, getDriverRides);


module.exports = router;