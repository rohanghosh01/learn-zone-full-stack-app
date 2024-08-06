const mongoose = require("mongoose");
const configJson = require("../config/config.json");
const config = require("../config/config.json")[configJson.ENVIRONMENT];
// let username = encodeURIComponent(config.MONGO_USERNAME);
// let password = encodeURIComponent(config.MONGO_PASSWORD);

// const MONGODB_URI = `mongodb://${username}:${password}@${config.MONGO_HOST_URL}`;
const MONGODB_URI = config.MONGODB_URL;


let cachedDb = null;
module.exports = connectToDatabase = () => {
  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }return mongoose.connect(MONGODB_URI)
    .then(db => {
      cachedDb = db;
      return cachedDb;
    })
    .catch(error => {
     console.log('Error mongodb connection Failed',error)
    });
}