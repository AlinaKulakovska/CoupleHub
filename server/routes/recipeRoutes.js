const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/RecipeController");

router.get("/", recipeCtrl.getAllRecipes);
router.post("/", recipeCtrl.createRecipe);

module.exports = router;