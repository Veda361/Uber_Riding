const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
    registerUser,
    getCurrentUser,
} = require("../controllers/userController");

// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "User Routes Working",
    });
});



/* 
router.get("/create-test-user", async(req, res) => {
    const User = require("../model/User");
    
    const user = await User.create({
        firebaseUid: "123456",
        name: "dev",
        email: "devranjeetq@gmail.com",
        role: "user",
    });
    res.json(user);

})

*/

router.post("/registerUser", protect, registerUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;