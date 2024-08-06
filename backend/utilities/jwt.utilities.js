const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretJson = require("../config/config.json");
const env = secretJson.ENVIRONMENT;
const config = require("../config/config.json")[env];

module.exports.JWTSign = (payload) => {
  try {
    const accessToken = jwt.sign(payload, config.JWT_AUTH_KEY, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    let refreshToken = jwt.sign(
      { ...payload, type: "refresh" },
      config.JWT_AUTH_KEY,
      {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN,
      }
    );
    return {
      status: true,
      expiresIn: config.JWT_EXPIRES_IN,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.log("error jwt  signing payload", err);
    return {
      status: false,
      expiresIn: config.JWT_EXPIRES_IN,
      accessToken: "",
    };
  }
};

module.exports.JWTVerify = (token) => {
  try {
    let data = jwt.verify(token, config.JWT_AUTH_KEY);
    return {
      status: true,
      data,
    };
  } catch (err) {
    return {
      status: false,
      data: "",
      error: err.message,
    };
  }
};
