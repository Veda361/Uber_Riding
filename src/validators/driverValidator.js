const { body } = require(
  "express-validator"
);

exports.driverValidation = [
  body("vehicleType")
    .notEmpty()
    .withMessage(
      "Vehicle type required"
    ),

  body("vehicleNumber")
    .notEmpty()
    .withMessage(
      "Vehicle number required"
    )
    .isLength({
      min: 6,
      max: 15,
    }),
];