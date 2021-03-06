const User = require("../../model/user-model");
const Recipe = require("../../model/recipe-model");
const authServices = require("../../services/auth-service");
const Favorites = require("../../model/favorite-model");

const fs = require("fs");
const path = require("path");


/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * fetch all the recipes
 */
exports.index = (req, res) => {
  Recipe.find({}, (error, recipe) => {
    if (error) {
      return res.status(500).json();
    }
    return res.status(200).json(recipe);
  }).populate("author", "username", "user");
};

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * find favorites recipes for the user
 */
exports.findFavorites = (req, res) => {
  const id = authServices.getUserId(req);
 
  Favorites.find({ userId: id }, (error, recipeData) => {
    if (error) {
      return res.status(500).json();
    }
   
    const recipesIds = recipeData.map((d) => {
      return d.recipeId;
    });

    // console.log(ids)

    Recipe.find({ _id: { $in: recipesIds } }, (error, recipes) => {
      if (error) {
        console.log(error);
        return res.status(500).json();
      }
      console.log(recipes, 999);
      return res.status(200).json({ recipes: recipes });
    });
  });
};

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * create recipe and save it to the database.
 */

exports.create = (req, res) => {
  const id = authServices.getUserId(req);
  const f = req.file;
  console.log(f, 999);
  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      return res.status(500).json();
    }

    if (!req.file) {
      throw new Error("No image provide.");
      return res.status(422).json();
    }

    const imageUrl = req.file.path.replace("\\", "/");
    console.log(req.body.ingredients, 999);
  
    const recipe = new Recipe({
      name: req.body.recipeName,
      type: req.body.recipeType,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      servings: req.body.servings,
      share: req.body.share,
      imageUrl: imageUrl,
    });

    console.log(recipe);
    recipe.author = user._id;

    recipe.save((error) => {
      if (error) {
        console.log(error);
        return res.status(500).json();
      }
      return res.status(200).json();
    });
  });
  return res.status(200).json();
};

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * add favorite to the database.
 */
exports.addFavorite = (req, res) => {
  // console.log(req.body.recipeId, 9999);
  const id = authServices.getUserId(req);
  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      return res.status(500).json();
    }

    const favorite = new Favorites({
      recipeId: req.body.recipeId,
    });

    favorite.userId = user._id;

    favorite.save((error) => {
      if (error) {
        console.log(error);
        return res.status(500).json();
      }
      return res.status(200).json();
    });
  });
  return res.status(200).json();
};


/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * update recipes.
 */
exports.update = (req, res) => {
  const id = authServices.getUserId(req);

  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    return res.status(422).json({ message: "No File Pick" });
  }

  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      return res.status(500).json();
    }
    if (!user) {
      return res.status(500).json({ message: "No user" });
    }

    const recipe = {
      name: req.body.recipeName,
      type: req.body.recipeType,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      servings: req.body.servings,
      share: req.body.share,
      imageUrl: imageUrl,
    };
    console.log(recipe);

    const recipeId = req.body._id;
    recipe.author = user._id;

    Recipe.findByIdAndUpdate(recipeId, recipe, (error, doc) => {
      if (imageUrl !== doc.imageUrl) {
        clearImage(doc.imageUrl);
      }
      if (error) {
        console.log(error);
        return res.status(500).json();
      }
      return res.status(200).json();
    });
  });
};

exports.updateFavorite = (req, res) => {
  console.log(req.body._id, 9999);
  const id = req.body._id;
  Recipe.findByIdAndUpdate(
    id,
    { $set: { favorite: req.body.favorite } },
    (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json("this do not work");
      }
      return res.status(200).json();
    }
  );
  return res.status(200).json();
};

exports.remove = (req, res) => {
  const id = authServices.getUserId(req);

  console.log(id);
  Recipe.findOne({ _id: req.params.id }, (error, recipe) => {
    if (error) {
      return res.status(500).json();
    }
    if (!recipe) {
      return res.status(500).json();
    }
    if (recipe.author._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: "Not allow to delete others Recipe" });
    }

    console.log(req.params.id);
    Recipe.deleteOne({ _id: req.params.id }, (error) => {
      clearImage(recipe.imageUrl);
      if (error) {
        return res.status(500).json();
      }
      return res.status(204).json();
    });
  });
};

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * remove favorite from the database.
 */

exports.removeFavorite = (req, res) => {
  console.log(req.params.id, 222);
  const id = authServices.getUserId(req);

  console.log(id);
  Favorites.findOne({ recipeId: req.params._id }, (error, recipe) => {
    if (error) {
      return res.status(500).json();
    }
    console.log(req.params.id, 555);

    Favorites.deleteOne({ recipeId: req.params.id }, (error) => {
      // clearImage(recipe.imageUrl)
      if (error) {
        return res.status(500).json();
      }
      return res.status(204).json();
    });
  });
};

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * show a single recipe from the database.
 */

exports.show = (req, res) => {
  console.log(req.params.id, 6666);
  Recipe.findOne({ _id: req.params.id }, (error, recipe) => {
    if (error) {
      return res.status(500).json();
    }
    if (!recipe) {
      return res.status(404).json();
    }
    return res.status(200).json(recipe);
  }).populate("author", "username", "user");
};

/**
 * 
 * @param {the path of the file to be clear from directory} filePath 
 */

const clearImage = (filePath) => {
  console.log(filePath, 777777);
  filePath = path.join(__dirname, "../../", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
