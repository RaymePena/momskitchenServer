const express = require("express");
const cors = require("cors");
const bodyParse = require("body-parser");

exports.setEnvironment = (app) => {
  if (process.env.NODE_ENV !== "production") {
    setDevEnviroment(app);
  } else {
    console.log("You are in production mode");
  }
};

function setDevEnviroment(app) {
  process.env.NODE_ENV = "development";
  process.env.DB_URL =
    "mongodb+srv://pub-quiz:1234@recipe.xz1wc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  process.env.TOKEN_SECRET = "herecomesthequiztoburn";
  app.use(express.json());
  app.use(cors());
}
