const Favorite = require('../models/Favorites')

const addRecipeToFavorites = async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
  
      let favorite = await Favorite.findOne({ userId });
  
      if (!favorite) {
        favorite = new Favorite({ userId, recipes: [recipeId] });
      } else {
        if (!favorite.recipes.includes(recipeId)) {
          favorite.recipes.push(recipeId);
        }
      }
  
      await favorite.save();
  
      res.status(200).json({ message: 'Recipe added to favorites' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const removeRecipeFromFavorites = async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
  
      const favorite = await Favorite.findOne({ userId });
  
      if (!favorite) {
        return res.status(404).json({ message: 'User has no favorite recipes' });
      }
  
      favorite.recipes = favorite.recipes.filter((id) => id.toString() !== recipeId);
  
      await favorite.save();
  
      res.status(200).json({ message: 'Recipe removed from favorites' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getUserFavorites = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const favorite = await Favorite.findOne({ userId }).populate('recipes');
  
      if (!favorite) {
        return res.status(404).json({ message: 'User has no favorite recipes' });
      }
  
      res.status(200).json(favorite.recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { addRecipeToFavorites, removeRecipeFromFavorites, getUserFavorites };