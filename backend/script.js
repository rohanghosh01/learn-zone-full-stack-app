const { writeFile } = require("fs");
const fs = require("fs");
require("dotenv").config();
const { argv } = require("yargs");

// SETUP
if (!fs.existsSync("./config/")) {
  fs.mkdirSync("./config/", { recursive: true });
}

const configuration = {
  SERVICE: process.env["SERVICE_NAME"],
  NODE_ENV: process.env["NODE_ENV"],
  BASE_PATH: process.env["BASE_PATH"],
  DOMAIN: process.env["DOMAIN"],
  PORT: process.env["PORT"],
  ENVIRONMENT: process.env["ENVIRONMENT"],
  S3_REGION: process.env["S3_REGION"],
  [argv.environment]: {
    JWT_AUTH_KEY: process.env["JWT_AUTH_KEY"],
    JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"],
    JWT_REFRESH_EXPIRES_IN: process.env["JWT_REFRESH_EXPIRES_IN"],
    MONGODB_URL: process.env["MONGODB_URL"],
    FIREBASE_CONFIG: {
      type: process.env["FIREBASE_TYPE"],
      project_id: process.env["FIREBASE_PROJECT_ID"],
      private_key_id: process.env["FIREBASE_PRIVATE_KEY_ID"],
      private_key: process.env["FIREBASE_PRIVATE_KEY"],
      client_email: process.env["FIREBASE_CLIENT_EMAIL"],
      client_id: process.env["FIREBASE_CLIENT_ID"],
      auth_uri: process.env["FIREBASE_AUTH_URI"],
      token_uri: process.env["FIREBASE_TOKEN_URI"],
      auth_provider_x509_cert_url: process.env["FIREBASE_CERT_URL"],
      client_x509_cert_url: process.env["FIREBASE_CLIENT_CERT_URL"],
      universe_domain: process.env["FIREBASE_UNIVERSITY_DOMAIN"],
    },
    BUCKET_NAME: process.env["BUCKET_NAME"],
    REDIS_STATUS: process.env["REDIS_STATUS"],
  },
};

writeFile("config/config.json", JSON.stringify(configuration), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Wrote variables to [configuration]`);
  }
});
