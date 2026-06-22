const User = require("../model/User");

const isAdmin = async (req, res, next) => {
    try{
        const user = await User.findOne({
            firebaseUid: req.user.uid,
        });

        if(!user || user.role == admin){
            res.status(403).json({
                message: "admin access only",
            });
        }
        next();
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = isAdmin;