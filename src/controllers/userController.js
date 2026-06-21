const user = require("../model/User");

const registerUser = async(req, res, next) => {
    try{
        const {uid, email} = req.user;

        let user = await User.findOne({
            firebaseUid: uid,
        });

        if(user){
            return res.status(200).json(user);
        }

        user = await User.create({
            firebaseUid: uid,
            email,
            name: req.body.name,
        });
        res.status(201).json(user);
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const getCurrentUser = async(req, res) => {
    try{
        const user = await User.findOne({
            firebaseUid: req.user.uid,
        });
        if(!user){
            return res.status(404).json({
                message: "user not found",
            });
        }
        res.json(user);
    }catch(error){
        res.status(500).json({
            message: error.message,
        })
    }
}

module.exports = {
    registerUser,
    getCurrentUser
};