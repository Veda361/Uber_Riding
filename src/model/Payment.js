const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
      ],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);