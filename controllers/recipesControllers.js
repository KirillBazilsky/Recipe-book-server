const Recipe = require('../models/Recipes');
const { User } = require('../models/Users')

const addRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, ingredients, instructions, category } = req.body;

    const user = await User.findById(userId);
    const creator = {name: user.name, id: user.id}
    const recipe = new Recipe({ name, ingredients, instructions, category, creator });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Recipe with this name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { recipeId, name, ingredients, instructions, category } = req.body;

    const recipe = await Recipe.findById(recipeId);

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if(name) recipe.name = name;
    if(ingredients) recipe.ingredients = ingredients;
    if(instructions) recipe.instructions = instructions;
    if(category) recipe.category = category;

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Recipe with this name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try{
    const { recipeId } = req.body;
    const recipe = await Recipe.findById(recipeId);

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const getRecipes = async (req, res) => {
  try {
    const { userId, name, category, ingredients } = req.body;

    const filter = {};

    if (userId) {
      filter['creator.id'] = userId;
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; 
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (ingredients) {
      filter.ingredients = { $elemMatch: { name: { $regex: ingredients } } };
    }

    const recipes = await Recipe.find(filter);

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addRecipe, updateRecipe, deleteRecipe, getRecipes };