const mongoose = require("mongoose");

const coupleProgressSchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Couple",
        required: true,
        unique: true
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    completedChallenges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge"
    }]
}, { timestamps: true });

module.exports = mongoose.model("CoupleProgress", coupleProgressSchema);