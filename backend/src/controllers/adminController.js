const User = require("../model/User");

const Driver = require("../model/Driver");

const Ride = require("../model/Ride");

const Payment = require("../model/Payment");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalDrivers = await Driver.countDocuments();

    const activeDrivers = await Driver.countDocuments({
      isAvailable: true,
    });

    const totalRides = await Ride.countDocuments();

    const completedRides = await Ride.countDocuments({
      status: "completed",
    });

    const cancelledRides = await Ride.countDocuments({
      status: "cancelled",
    });

    const payments = await Payment.find({
      status: "paid",
    });

    const totalRevenues = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    res.json({
      success: true,
      status: totalUsers,
      totalDrivers,
      activeDrivers,
      totalRides,
      completedRides,
      cancelledRides,
      totalRevenues,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("userId").sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("riderId")
      .populate("driverId")
      .sort({
        createdAt: -1,
      });
    res.json({
      success: true,
      count: Ride.length,
      rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId")
      .populate("rideId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllDrivers,
  getAllRides,
  getAllPayments,
};
