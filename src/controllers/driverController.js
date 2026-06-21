const User = require("../model/User");
const Driver = require("../model/Driver");
const Ride = require("../model/Ride");
const Review = require("../model/Review");


const registerDriver = async(req, res)=>{
    try{
        const {vehicleType, vehicleNumber} = req.body;

        const user = await User.findOne({
            firebaseUid: req.User.uid,
        });

        const driver = await Driver.create({
            userId: user._id,
            vehicleType,
            vehicleNumber,

        });

        res.status(201).json(driver);

    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }

};

const goOnline = async(req, res)=>{
    try{
        const {lat, lng} = req.body;

        const user = await User.findOne({
            firebaseUid: req.user.uid,
        })

        await User.findByIdAndUpdate(user._id, {
            isOnline: true,
        });

        await Driver.findOneAndUpdate({
            userId: user._id
        },
        {
            location: {
                type: "Point",
                coordinate: [lng, lat],
            },
        }
    );
    res.json({
        success: true,
        message: "Driver Online",
    });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const goOffline = async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    const driver = await Driver.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        isAvailable: false,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Driver Offline",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDriverStats = async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalRides = await Ride.countDocuments({
      driverId: user._id,
    });

    const completedRides = await Ride.countDocuments({
      driverId: user._id,
      status: "completed",
    });

    const cancelledRides = await Ride.countDocuments({
      driverId: user._id,
      status: "cancelled",
    });

    const rides = await Ride.find({
      driverId: user._id,
      status: "completed",
    });

    const totalEarnings = rides.reduce(
      (sum, ride) => sum + (ride.fare || 0),
      0
    );

    const reviews = await Review.find({
      driverId: user._id,
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / totalReviews
          ).toFixed(1)
        : 0;

    const completionRate =
      totalRides > 0
        ? (
            (completedRides /
              totalRides) *
            100
          ).toFixed(2)
        : 0;

    res.json({
      success: true,
      stats: {
        totalRides,
        completedRides,
        cancelledRides,
        totalEarnings,
        totalReviews,
        averageRating,
        completionRate,
        isOnline: user.isOnline,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {registerDriver, goOnline, goOffline, getDriverStats};