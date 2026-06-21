const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {registerDriver, goOnline} = require("../controllers/driverController");


router.post("/registerDriver", protect,  registerDriver);

router.post("/online", protect, goOnline);

module.exports = router;