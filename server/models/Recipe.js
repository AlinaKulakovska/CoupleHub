const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  time: { 
    type: Number, 
    required: true 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  ingredients: [{ 
    type: String, 
    required: true,
    trim: true 
  }],
  image: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);