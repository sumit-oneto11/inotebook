const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB at ", mongoURI);

      return mongoose.connection;
    })
    .catch((err) => console.log(`Database connection error: ${err}`));
};

module.exports = connectToMongo;
