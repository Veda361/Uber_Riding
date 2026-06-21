const User = require("../model/User");
const Driver = require("../model/Driver")


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

module.exports = {registerDriver, goOnline, goOffline,};