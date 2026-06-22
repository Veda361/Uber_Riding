const Notification = require(
  "../model/Notification"
);

const User = require(
  "../model/User"
);


const getNotifications = async (
  req,
  res
) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    const notifications =
      await Notification.find({
        userId: user._id,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getNotifications,
  markAsRead,
};