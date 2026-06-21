const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {registerDriver, goOnline, goOffline, getDriverStats} = require("../controllers/driverController");


router.post("/registerDriver", protect,  registerDriver);

router.post("/online", protect, goOnline);

router.post("/offline", protect, goOffline);

router.get("/driver/stats", protect, getDriverStats);
module.exports = router;