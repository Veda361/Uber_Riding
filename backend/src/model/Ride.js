const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    pickup: {
      address: String,
      lat: Number,
      lng: Number,
    },

    destination: {
      address: String,
      lat: Number,
      lng: Number,
    },

    currentLocation: {
      lat: Number,
      lng: Number,
    },

    fare: {
      type: Number,
      default: 0,
    },

    distance: {
        type: Number,
        default: 0
    },

    duration: {
        type: Number,
        default: 0,
    },

    isPaid: {
        type: Boolean,
        default: false,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "arriving",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", rideSchema);