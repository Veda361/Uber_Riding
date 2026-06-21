const Ride = require("../model/Ride");

const connectedUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User Connected: ${socket.id}`);

    // Register User
    socket.on("register-user", (userId) => {
      connectedUsers[userId] = socket.id;

      console.log(`✅ User Registered: ${userId}`);
    });

    // Join Ride Room
    socket.on("join-ride", (rideId) => {
      socket.join(rideId);

      console.log(
        `🚕 Socket ${socket.id} joined ride room ${rideId}`
      );

      socket.emit("joined-ride", {
        rideId,
      });
    });

    // Driver Live Location Update
    socket.on(
      "location-update",
      async ({ rideId, lat, lng }) => {
        try {
          if (!rideId || !lat || !lng) {
            return;
          }

          await Ride.findByIdAndUpdate(
            rideId,
            {
              currentLocation: {
                lat,
                lng,
              },
            }
          );

          io.to(rideId).emit(
            "driver-location",
            {
              rideId,
              lat,
              lng,
              updatedAt: new Date(),
            }
          );

          console.log(
            `📍 Ride ${rideId}: ${lat}, ${lng}`
          );
        } catch (error) {
          console.error(
            "Location Update Error:",
            error
          );
        }
      }
    );

    // Driver Started Ride
    socket.on("ride-started", (rideId) => {
      io.to(rideId).emit(
        "ride-started",
        {
          rideId,
        }
      );

      console.log(
        `🚀 Ride Started: ${rideId}`
      );
    });

    // Driver Completed Ride
    socket.on(
      "ride-completed",
      ({ rideId, fare }) => {
        io.to(rideId).emit(
          "ride-completed",
          {
            rideId,
            fare,
          }
        );

        console.log(
          `✅ Ride Completed: ${rideId}`
        );
      }
    );

    socket.on("disconnect", () => {
      console.log(
        `❌ User Disconnected: ${socket.id}`
      );

      Object.keys(connectedUsers).forEach(
        (userId) => {
          if (
            connectedUsers[userId] === socket.id
          ) {
            delete connectedUsers[userId];
          }
        }
      );
    });
  });
};

module.exports = {
  socketHandler,
  connectedUsers,
};