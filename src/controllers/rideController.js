const Ride = require("../models/Ride");
const User = require("../model/User");

const requestRide = async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    const mongoUser = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!mongoUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const ride = await Ride.create({
      riderId: mongoUser._id,
      pickup,
      destination,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  requestRide,
};