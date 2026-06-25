// models/Couple.js
const mongoose = require("mongoose");

const coupleSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // Will be null until the second partner joins
    },
    anniversaryDate: {
        type: Date,
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt tracking

module.exports = mongoose.model("Couple", coupleSchema);