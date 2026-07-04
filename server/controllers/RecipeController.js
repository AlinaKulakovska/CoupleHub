const Recipe = require("../models/Recipe");

// Get all recipes stored in the database
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve recipes from the database.", error: error.message });
  }
};

// Save a new recipe to the database
exports.createRecipe = async (req, res) => {
  try {
    const { title, time, tags, ingredients, image } = req.body;
    
    if (!title || !time || !ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: "Missing required recipe fields." });
    }

    const newRecipe = new Recipe({
      title,
      time: parseInt(time),
      tags: Array.isArray(tags) ? tags : [],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      image
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to save recipe to the database.", error: error.message });
  }
};