const express = require("express");
const router = express.Router();
const recipeController = require("./recipe-controller");
const authServices = require("../../services/auth-service");

router.post("/recipe", authServices.requireLogin, recipeController.create);
router.get("/recipe", recipeController.index);
router.post(
  "/recipe/favorite",
  authServices.requireLogin,
  recipeController.addFavorite
);
router.get(
  "/recipe/favorite",
  authServices.requireLogin,
  recipeController.findFavorites
);
router.get("/recipe/:id", recipeController.show);
router.put("/recipe", authServices.requireLogin, recipeController.update);
router.delete(
  "/recipe/:id",
  authServices.requireLogin,
  recipeController.remove
);
router.delete(
  "/recipe/favorite/:id",
  authServices.requireLogin,
  recipeController.removeFavorite
);
router.delete(
  "/single-recipe/:id",
  authServices.requireLogin,
  recipeController.removeFavorite
);
router.put(
  "/recipe/:id",
  authServices.requireLogin,
  recipeController.updateFavorite
);

module.exports = router;
