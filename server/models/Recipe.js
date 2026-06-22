const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  category: String,
  image: String
});

module.exports = mongoose.model("Recipe", recipeSchema);