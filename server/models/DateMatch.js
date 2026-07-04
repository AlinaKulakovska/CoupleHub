const mongoose = require("mongoose");

const dateMatchSchema = new mongoose.Schema({
  couple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Couple",
    required: true
  },
  dateIdeaId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, default: "At Home" },
  cost: { type: String, default: "Free" },
  category: { type: String, default: "At-home" },
  image: { type: String },
  // Tracks individual swipe selections
  likes: {
    type: Map,
    of: Boolean, // e.g., { "USER_1_ID": true, "USER_2_ID": false }
    default: {}
  },
  isMatched: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("DateMatch", dateMatchSchema);