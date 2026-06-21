const Notification = require(
  "../model/Notification"
);

const createNotification =
  async (
    userId,
    title,
    message
  ) => {
    return await Notification.create({
      userId,
      title,
      message,
    });
  };

module.exports =
  createNotification;