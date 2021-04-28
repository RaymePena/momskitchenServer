const authRoutes = require("./api/auth/auth-routes");
const userRoutes = require("./api/user/user-routes");
const SignUpRoutes = require("./api/signUp/signup-routers");
const recipeRoutes = require("./api/Recipe/recipe-routes");
const ratingRoutes = require('./api/Rating/rating-routes')
const groceryRoutes = require('./api/Grocery/grocery-routes')

function registerRouter(app) {
  app.use("/api", SignUpRoutes);
  app.use("/api", userRoutes);
  app.use("/api", authRoutes);
  app.use("/api", recipeRoutes);
  app.use('/api', ratingRoutes)
  app.use('/api', groceryRoutes)
}

module.exports = registerRouter;
