const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Couple",
        required: true
    },
    title: { type: String, required: true },
    assignedTo: { 
        type: String, 
        enum: ["Together", "User1", "User2"], 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ["High", "Medium", "Low"], 
        default: "Medium" 
    },
    dueDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);