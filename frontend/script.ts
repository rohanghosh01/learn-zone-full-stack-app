const { writeFile } = require("fs");
const fs = require("fs");
require("dotenv").config();

// SETUP
if (!fs.existsSync("./config/")) {
  fs.mkdirSync("./config/", { recursive: true });
}

const configuration = {
  ENVIRONMENT: process.env["ENVIRONMENT"],
  NODE_ENV: process.env["NODE_ENV"],
  BASE_PATH: process.env["BASE_PATH"],
  DOMAIN: process.env["DOMAIN"],
  API_BASE_URL: process.env["API_BASE_URL"],
  SOCKET_BASE_URL: process.env["SOCKET_BASE_URL"],
  CRYPTO_KEY: process.env["CRYPTO_KEY"],
  DEFAULT_PROFILE: process.env["DEFAULT_PROFILE"],
  FIREBASE_CONFIG: {
    apiKey: process.env["FIREBASE_API_KEY"],
    authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
    projectId: process.env["FIREBASE_PROJECT_ID"],
    storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
    messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"],
    appId: process.env["FIREBASE_APP_ID"],
    measurementId: process.env["FIREBASE_MEASUREMENT_ID"],
  },
};

writeFile("config/config.json", JSON.stringify(configuration), (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Wrote variables to [configuration]`);
  }
});
