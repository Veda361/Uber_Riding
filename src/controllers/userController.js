const User = require("../model/User");

const registerUser = async (req, res) => {
  try {
    const { uid, email } = req.user;

    let existingUser = await User.findOne({
      firebaseUid: uid,
    });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = await User.create({
      firebaseUid: uid,
      email,
      name: req.body.name,
      role: re.body.role || "rider"
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(currentUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  getCurrentUser,
};