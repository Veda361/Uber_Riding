const express = require("express");

const router = express.Router();

const {
  requestRide,
  acceptRide,
  startRide,
  completeRide,
} = require("../controllers/rideController");

const protect = require("../middlewares/authMiddleware");

router.post("/request", protect, requestRide);
router.put("/:id/accept", protect, acceptRide);
router.put("/:id/start", protect, startRide);
router.put("/:id/complete", protect, completeRide);


module.exports = router;