const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Couple",
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { 
        type: String, 
        enum: ["Travel", "Movie", "Anniversary", "General"], 
        default: "General" 
    },
    image: { type: String }, // Stores the Base64 image data string
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Memory", memorySchema);