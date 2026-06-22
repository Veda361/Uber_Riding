const crypto = require("crypto");

const Razorpay = require("../config/razorpay");
const Payment = require("../model/Payment");
const Ride = require("../model/Ride");
const User = require("../model/User");

const createOrder = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride Not Found",
      });
    }

    const options = {
      amount: ride.fare * 100,
      currency: "INR",
      receipt: ride._id.toString(),
    };

    const order = await Razorpay.orders.create(
      options
    );

    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    await Payment.create({
      rideId: ride._id,
      userId: user._id,
      amount: ride.fare,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
          "|" +
          razorpay_payment_id
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        message:
          "Payment Verification Failed",
      });
    }

    const payment =
      await Payment.findOne({
        razorpayOrderId:
          razorpay_order_id,
      });

    if (!payment) {
      return res.status(404).json({
        message: "Payment Not Found",
      });
    }

    payment.status = "paid";

    payment.razorpayPaymentId =
      razorpay_payment_id;

    await payment.save();

    const ride =
      await Ride.findById(
        payment.rideId
      );

    if (ride) {
      ride.isPaid = true;
      await ride.save();
    }

    res.json({
      success: true,
      message:
        "Payment Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};