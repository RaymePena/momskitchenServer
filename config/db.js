const mongoose = require("mongoose");

exports.connectToDB = () => {
  mongoose.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (error) => {
      if (error) {
        console.log("Unable to connect to database");
        throw error;
      } else {
        console.log("Connected to Mongo DB");
      }
    }
  );
};
