const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const recipesController = require("../controllers/recipesControllers");

router.post("/:userId", authMiddleware, recipesController.addRecipe);
router.put("/:userId", authMiddleware, recipesController.updateRecipe);
router.delete("/:userId", authMiddleware, recipesController.deleteRecipe);
router.get("/:userId", recipesController.getRecipes);

module.exports = router;
