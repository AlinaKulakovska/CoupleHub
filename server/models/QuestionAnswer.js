const mongoose = require("mongoose");

const questionAnswerSchema = new mongoose.Schema({
  dateKey: { 
    type: String, 
    required: true, 
    unique: true // Format: "YYYY-MM-DD" (e.g. "2026-07-31")
  },
  question: { 
    type: String, 
    required: true 
  },
  answers: {
    Alex: { type: String, default: "" },
    Sam: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model("QuestionAnswer", questionAnswerSchema);