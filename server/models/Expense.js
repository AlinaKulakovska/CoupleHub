const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Couple",
        required: true
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ["Food", "Entertainment", "Transport", "Shopping", "Utilities", "Health"], 
        required: true 
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);