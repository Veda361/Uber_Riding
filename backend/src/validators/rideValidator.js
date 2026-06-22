const { body } = require(
  "express-validator"
);

exports.requestRideValidation = [
  body("pickup.address")
    .notEmpty()
    .withMessage(
      "Pickup address required"
    ),

  body("destination.address")
    .notEmpty()
    .withMessage(
      "Destination address required"
    ),

  body("pickup.lat")
    .isFloat()
    .withMessage(
      "Pickup latitude invalid"
    ),

  body("pickup.lng")
    .isFloat()
    .withMessage(
      "Pickup longitude invalid"
    ),
];