const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    xpReward: { type: Number, required: true },
    icon: { type: String, default: "🏆" }
});

module.exports = mongoose.model("Challenge", challengeSchema);