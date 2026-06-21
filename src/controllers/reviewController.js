const Review = require("../model/Review");
const Ride = require("../model/Ride");
const User = require("../model/User");

const createReview = async (req, res) => {
  try {
    const {
      rideId,
      rating,
      comment,
    } = req.body;

    const rider = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!rider) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const ride = await Ride.findById(
      rideId
    );

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (
      ride.status !== "completed"
    ) {
      return res.status(400).json({
        message:
          "Ride must be completed before review",
      });
    }

    const existingReview =
      await Review.findOne({
        rideId,
      });

    if (existingReview) {
      return res.status(400).json({
        message:
          "Review already submitted",
      });
    }

    const review =
      await Review.create({
        rideId,
        riderId: rider._id,
        driverId: ride.driverId,
        rating,
        comment,
      });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getDriverReviews = async (
  req,
  res
) => {
  try {
    const reviews =
      await Review.find({
        driverId: req.params.id,
      })
        .populate(
          "riderId",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce(
              (
                sum,
                review
              ) =>
                sum +
                review.rating,
              0
            ) /
            totalReviews
          ).toFixed(1)
        : 0;

    res.json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createReview,
  getDriverReviews,
};