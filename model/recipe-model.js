const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    requiere: true,
  },
  type: {
    type: String,
    require: true,
  },
  ingredients: [{}],
  instructions: [{}],
  prepTime: String,
  cookTime: String,
  servings: String,
  share: Boolean,
  comment: String,
  averageRating: Number,
  imageUrl: {
    type: String,
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

recipeSchema.set("timestamps", true);

module.exports = mongoose.model("recipe", recipeSchema);
