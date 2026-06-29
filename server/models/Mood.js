const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Couple",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    emoji: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, required: true } // Stores the specific Tailwind color variant
}, { timestamps: true });

module.exports = mongoose.model("Mood", moodSchema);