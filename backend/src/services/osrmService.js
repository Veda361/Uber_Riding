const axios = require("axios");

const getDistanceAndDuration = async (
  pickup,
  destination
) => {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${pickup.lng},${pickup.lat};` +
      `${destination.lng},${destination.lat}` +
      `?overview=false`;

    const response = await axios.get(url);

    const route =
      response.data.routes[0];

    return {
      distance:
        route.distance / 1000,
      duration:
        route.duration / 60,
    };
  } catch (error) {
    console.error(
      "OSRM Error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  getDistanceAndDuration,
};