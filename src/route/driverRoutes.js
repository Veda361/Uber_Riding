const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const {
  registerDriver,
  goOnline,
  goOffline,
  getDriverStats,
} = require("../controllers/driverController");

const { driverValidation } = require("../validators/driverValidator");

router.post("/register", protect, driverValidation, validate, registerDriver);

router.post("/online", protect, goOnline);

router.post("/offline", protect, goOffline);

router.get("/stats", protect, getDriverStats);

module.exports = router;
