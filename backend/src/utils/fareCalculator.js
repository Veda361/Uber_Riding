const calculateFare = (
  distance
) => {
  const baseFare = 50;

  const perKm = 12;

  return Math.round(
    baseFare +
      distance * perKm
  );
};

module.exports =
  calculateFare;