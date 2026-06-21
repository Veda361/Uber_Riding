const Ride = require("../model/Ride");
const User = require("../model/User");
const Driver = require("../model/Driver")

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
    
    const nearbyDrivers =  Driver.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        pickup.lng,
                        pickup.lat,
                    ],
                },
                $maxDistance: 5000,
            },
        },
    });

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

const acceptRide = async(req, res) => {
    try{
        const ride = await Ride.findById(req.params.id);

        if(!ride){
            return res.status(404).json({
                message: "ride not found",
            });

            const user = await User.findOne({
                firebaseUid: req.user.uid,
            });

            const driver = await Driver.findOne({
                userId: user._id,
            });

            ride.driverId = driver.userId;
            ride.status = "accepted";

            await ride.save();

            res.json(ride);
        }
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const startRide = async(req, res) => {
    try{
        const ride = await Ride.findById(req.params.id);

        ride.status = "in_progress";

        await ride.save();

        res.json(ride);
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const completeRide = async(req, res)=>{
    try{
        const ride = await Ride.findById(req.params.id);

        ride.status = "completed";

        await ride.save();

        res.json(ride);
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = {
 requestRide,
 acceptRide,
 startRide,
 completeRide,
};