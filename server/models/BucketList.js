const mongoose = require("mongoose");

const bucketListItemSchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Couple",
        required: true
    },
    title: { type: String, required: true },
    category: { 
        type: String, 
        enum: ["Travel", "Food", "Movies", "Adventures"], 
        required: true 
    },
    isCompleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("BucketListItem", bucketListItemSchema);