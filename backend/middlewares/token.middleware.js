const languageHelper = require("./../utilities/language.utilities");
const jwtAuth = require("../utilities/jwt.utilities");
const returnResponse = require("../utilities/returnResponse");
const userService = require("../services/user.service");
const secretJson = require("../config/config.json");
const secretEnvironment = require("../config/config.json")[
  secretJson.ENVIRONMENT
];
const config = secretEnvironment;

const tokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization : "";
    if (!token) {
      const constants = await languageHelper(req.locals.language);
      return res.status(403).json({
        error: constants.TOKEN_REQUIRED_ERROR,
        errorMessage: constants.TOKEN_VALIDATION,
      });
    }

    const [type, tokenData] = token.split(" ");
    if (type.toLowerCase() !== "bearer") {
      const constants = await languageHelper(req.locals.language);
      return res.status(403).json({
        error: constants.TOKEN_INVALID_ERROR,
        errorMessage: constants.TOKEN_EXPIRED,
      });
    }

    const jwtData = await jwtAuth.JWTVerify(tokenData);
    if (!jwtData || jwtData.status === false) {
      const constants = await languageHelper(req.locals.language);
      console.log(">>>>>>>>>>>>>>>>>>>log", jwtData);
      return res.status(403).json({
        error: constants.TOKEN_INVALID_ERROR,
        errorMessage: constants.TOKEN_EXPIRED,
      });
    }

    const path = req.path.split("/")[1];
    if (path === "user" && jwtData.data.tokenType !== "login") {
      const constants = await languageHelper(req.locals.language);
      return res.status(403).json({
        error: constants.TOKEN_INVALID_ERROR,
        errorMessage: constants.TOKEN_EXPIRED,
      });
    }

    const uid = jwtData.data.uid;
    const userInfo = await userService.getCount({ uid, deletedAt: null });
    if (!userInfo) {
      const constants = await languageHelper(req.locals.language);
      return res.status(404).json({
        error: constants.NOT_FOUND,
        errorMessage: constants.USER_NOT_FOUND,
      });
    }

    req.locals.userData = jwtData.data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = tokenMiddleware;
