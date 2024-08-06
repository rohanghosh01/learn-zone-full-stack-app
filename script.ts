const { writeFile } = require("fs");
const fs = require("fs");
require("dotenv").config();
const { argv } = require("yargs");
const environment = argv.environment;

if (!fs.existsSync("./backend/config/")) {
  fs.mkdirSync("./backend/config/", { recursive: true });
}
if (!fs.existsSync("./frontend/config/")) {
  fs.mkdirSync("./frontend/config/", { recursive: true });
}
if (!fs.existsSync("./socketIO/config/")) {
  fs.mkdirSync("./socketIO/config/", { recursive: true });
}

const backendConfiguration = {
  SERVICE: process.env["SERVICE_NAME"],
  NODE_ENV: process.env["NODE_ENV"],
  BASE_PATH: process.env["BASE_PATH"],
  DOMAIN: process.env["DOMAIN"],
  ENVIRONMENT: process.env["ENVIRONMENT"],
  [argv.environment]: {
    database: process.env["DATABASE"],
    host: process.env["DB_HOST"],
    env_variable: process.env["ENV_VARIABLE"],
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

const frontendConfiguration = {
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

const socketConfiguration = {
  SERVICE: process.env["SERVICE_NAME"],
  NODE_ENV: process.env["NODE_ENV"],
  BASE_PATH: process.env["BASE_PATH"],
  DOMAIN: process.env["DOMAIN"],
  ENVIRONMENT: process.env["ENVIRONMENT"],
  PORT: process.env["SOCKET_PORT"],
  [argv.environment]: {
    database: process.env["DATABASE"],
    host: process.env["DB_HOST"],
    env_variable: process.env["ENV_VARIABLE"],
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

writeFile(
  "backend/config/config.json",
  JSON.stringify(backendConfiguration),
  (err: any) => {
    if (err) {
      console.log(err, backendConfiguration);
    } else {
      console.log(`Wrote variables to [backendConfiguration]`);
    }
  }
);
writeFile(
  "frontend/config/config.json",
  JSON.stringify(frontendConfiguration),
  (err: any) => {
    if (err) {
      console.log(err, frontendConfiguration);
    } else {
      console.log(`Wrote variables to [frontendConfiguration]`);
    }
  }
);
writeFile(
  "socketIO/config/config.json",
  JSON.stringify(socketConfiguration),
  (err: any) => {
    if (err) {
      console.log(err, socketConfiguration);
    } else {
      console.log(`Wrote variables to [socketConfiguration]`);
    }
  }
);
