const driverSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    vehicleType: String,
    vehicleNumber: String,

    location: {
        type: {
            type: String,
            enum: ["point"],
            default: "point",
        },
        coordinates: {
            type: [Number],
        },
    },
});

driverSchema.index({location: "2dsphere" });