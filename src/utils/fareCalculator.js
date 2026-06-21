const calculateFare = (distance) => {
    const basePrice = 50;
    const perKm = 12;

    return basePrice+ distance*perKm;
};

module.exports = calculateFare;