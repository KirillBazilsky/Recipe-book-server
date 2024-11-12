const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const favoritesController = require("../controllers/favoritesControllers");

router.post('/:userId', authMiddleware, favoritesController.addRecipeToFavorites);
router.delete('/:userId', authMiddleware, favoritesController.removeRecipeFromFavorites);
router.get('/:userId', authMiddleware, favoritesController.getUserFavorites);

module.exports = router;