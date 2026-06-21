const Ride = require("../model/Ride");
const User = require("../model/User");
const Driver = require("../model/Driver");
const calculateFare = require("../utils/fareCalculator");
const { connectedUsers } = require("../sockets/socketHandler");
const createNotification = require("../utils/createNotification");

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

    const nearbyDrivers = await Driver.find({
      isAvailable: true,

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [pickup.lng, pickup.lat],
          },
          $maxDistance: 5000,
        },
      },
    });

    const io = req.app.get("io");

    // Notify only nearby connected drivers
    for (const driver of nearbyDrivers) {
      const socketId = connectedUsers[driver.userId.toString()];

      await createNotification(
        driver.userId,
        "New Ride Request",
        "A rider nearby needs a ride.",
      );

      if (socketId) {
        io.to(socketId).emit("new-ride", {
          rideId: ride._id,
          pickup,
          destination,
        });
      }
    }

    // Auto cancel after 30 sec if nobody accepts
    setTimeout(async () => {
      const currentRide = await Ride.findById(ride._id);

      if (currentRide && currentRide.status === "pending") {
        currentRide.status = "cancelled";

        await currentRide.save();

        console.log(`Ride ${ride._id} cancelled due to timeout`);
      }
    }, 30000);

    res.status(201).json({
      success: true,
      ride,
      nearbyDrivers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    // Ride Lock
    if (ride.status !== "pending") {
      return res.status(400).json({
        message: "Ride already accepted",
      });
    }

    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const driver = await Driver.findOne({
      userId: user._id,
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    // Driver already busy?
    const activeRide = await Ride.findOne({
      driverId: driver.userId,
      status: {
        $in: ["accepted", "in_progress"],
      },
    });

    if (activeRide) {
      return res.status(400).json({
        message: "Driver already on another ride",
      });
    }

    ride.driverId = driver.userId;
    ride.status = "accepted";

    driver.isAvailable = false;

    await driver.save();
    await ride.save();

    await createNotification(
      ride.riderId,
      "Ride Accepted",
      "A driver has accepted your ride request.",
    );
    const io = req.app.get("io");

    io.to(ride._id.toString()).emit("ride-accepted", {
      rideId: ride._id,
      driverId: driver.userId,
    });

    res.json({
      success: true,
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    ride.status = "in_progress";

    await ride.save();

    await createNotification(
      ride.riderId,
      "Ride Started",
      "Your trip is now in progress.",
    );

    const io = req.app.get("io");

    io.to(ride._id.toString()).emit("ride-started", {
      rideId: ride._id,
    });

    res.json({
      success: true,
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    const distance = 8;

    ride.fare = calculateFare(distance);
    ride.status = "completed";

    await ride.save();

    await createNotification(
      ride.riderId,
      "Ride Completed",
      `Trip completed. Fare: ₹${ride.fare}`,
    );

    // Driver becomes available again
    const driver = await Driver.findOne({
      userId: ride.driverId,
    });

    if (driver) {
      driver.isAvailable = true;
      await driver.save();
    }

    const io = req.app.get("io");

    io.to(ride._id.toString()).emit("ride-completed", {
      rideId: ride._id,
      fare: ride.fare,
    });

    res.json({
      success: true,
      fare: ride.fare,
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyRides = async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const rides = await Ride.find({
      riderId: user._id,
    })
      .populate("driverId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDriverRides = async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const rides = await Ride.find({
      driverId: user._id,
    })
      .populate("riderId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRideLocation = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    res.json({
      success: true,
      location: {
        lat: ride.currentLocation?.lat,
        lng: ride.currentLocation?.lng,
      },
      updatedAt: ride.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  requestRide,
  acceptRide,
  startRide,
  completeRide,
  getMyRides,
  getDriverRides,
  getRideLocation,
};
