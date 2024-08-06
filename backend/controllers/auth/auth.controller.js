const returnResponse = require("../../utilities/returnResponse");
const {
  signUpValidation,
  verifyValidation,
  forgotPasswordValidation,
  loginValidation,
  googleLoginValidation,
  resetValidation,
} = require("../../validators/signUp.validator");
const userService = require("../../services/user.service");
const firebaseService = require("../../services/firebase.service");
const languageHelper = require("../../utilities/language.utilities");
const { encryptPassword, decryptPassword } = require("../../utilities/bcrypt");
const { JWTSign, JWTVerify } = require("../../utilities/jwt.utilities");

module.exports.signup = async (req, res) => {
  let reqBody = req.body || {};
  let language = req.locals.language;
  const OTP = "111111";

  console.log(">>", reqBody);

  const constants = await languageHelper(language);
  try {
    let validation = await signUpValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }
    let { email, password, userName } = reqBody;

    if (!userName.includes("@")) {
      userName = `@${userName}`;
    }

    let checkEmail = await userService.findOne({ email });
    let checkUsername = await userService.findOne({ userName });

    if (checkEmail) {
      return returnResponse(res, 400, {
        error: constants.ALREADY_EXIST_ERROR,
        errorMessage: constants.EMAIL_EXIST_ERROR,
      });
    }

    if (checkUsername) {
      return returnResponse(res, 400, {
        error: constants.ALREADY_EXIST_ERROR,
        errorMessage: constants.USERNAME_EXIST_ERROR,
      });
    }

    let encryptedPassword = encryptPassword(password);
    let hashToken = encryptPassword(OTP);

    let insertData = {
      password: encryptedPassword,
      name: reqBody.firstName + " " + reqBody.lastName,
      email: reqBody.email,
      profileImage: reqBody.profileImage,
      userName: userName,
    };

    let { uid } = await userService.insert(insertData);

    let jwtTokenData = JWTSign({
      ...insertData,
      uid,
      tokenType: "verify",
      hashToken,
    });

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    return returnResponse(res, 200, {
      message: constants.REGISTER_SUCCESS,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in signup controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.verify = async (req, res) => {
  let reqBody = req.body || {};
  let language = req.locals.language;
  let { hashToken, tokenType, name, email, uid } = req.locals.userData;
  const constants = await languageHelper(language);

  if (!hashToken && (tokenType != "verify" || tokenType != "forgot")) {
    return returnResponse(res, 400, {
      error: constants.TOKEN_INVALID_ERROR,
      errorMessage: constants.TOKEN_EXPIRED,
    });
  }
  try {
    /* verify otp */

    let validation = await verifyValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }
    let { otp } = reqBody;

    let decryptOtp = await decryptPassword(otp, hashToken);

    if (!decryptOtp) {
      return returnResponse(res, 400, {
        error: constants.WRONG_OTP,
        errorMessage: constants.WRONG_OTP_MSG,
      });
    }

    let tokenData = {
      name,
      email,
      uid,
      tokenType: "login",
    };

    if (tokenType == "forgot") {
      tokenData.tokenType = "restPassword";
    }

    let jwtTokenData = JWTSign(tokenData);

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    await userService.updateOne({ uid }, { emailVerified: true });

    return returnResponse(res, 200, {
      message: constants.VERIFY_OTP,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in verify controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  let reqBody = req.body || {};
  let language = req.locals.language;
  let { tokenType, name, email, uid } = req.locals.userData;
  const constants = await languageHelper(language);

  if (tokenType != "restPassword") {
    return returnResponse(res, 400, {
      error: constants.TOKEN_INVALID_ERROR,
      errorMessage: constants.TOKEN_EXPIRED,
    });
  }
  try {
    /* verify otp */

    let validation = await resetValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }
    let { password } = reqBody;

    let encryptedPassword = encryptPassword(password);

    await userService.updateOne({ uid }, { password: encryptedPassword });

    let tokenData = {
      name,
      email,
      uid,
      tokenType: "login",
    };

    let jwtTokenData = JWTSign(tokenData);

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    await userService.updateOne({ uid }, { emailVerified: true });

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in reset password controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.resendOtp = async (req, res) => {
  let language = req.locals.language;
  const OTP = "111111";
  let { exp, iat, ...userData } = req.locals.userData;
  const constants = await languageHelper(language);
  try {
    let hashToken = encryptPassword(OTP);

    let jwtTokenData = JWTSign({
      ...userData,
      tokenType: "verify",
      hashToken,
    });

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in resendOtp controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.forgotPassword = async (req, res) => {
  let language = req.locals.language;
  const OTP = "111111";
  let reqBody = req.body || {};
  const constants = await languageHelper(language);
  try {
    let validation = await forgotPasswordValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    let { uid, email, name } = await userService.findOne({
      email: reqBody.email,
    });

    if (!uid) {
      return returnResponse(res, 400, {
        error: constants.NOT_FOUND,
        errorMessage: constants.USER_NOT_FOUND,
      });
    }

    let hashToken = encryptPassword(OTP);

    let jwtTokenData = JWTSign({
      uid,
      email,
      name,
      tokenType: "forgot",
      hashToken,
    });

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in resendOtp controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.refreshToken = async (req, res) => {
  let language = req.locals.language;
  let { iat, exp, ...tokenData } = req.locals.userData;
  let type = tokenData.type;

  const constants = await languageHelper(language);
  try {
    if (!type || type != "refresh") {
      return returnResponse(res, 400, {
        error: constants.TOKEN_INVALID_ERROR,
        errorMessage: constants.TOKEN_EXPIRED,
      });
    }

    let jwtTokenData = JWTSign(tokenData);

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in refreshToken controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.login = async (req, res) => {
  let reqBody = req.body || {};
  let language = req.locals.language;
  const OTP = "111111";

  const constants = await languageHelper(language);
  try {
    let hashToken = encryptPassword(OTP);
    let validation = await loginValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    let userInfo = await userService.findOne({
      email: reqBody.email,
      socialType: "email",
    });

    if (!userInfo) {
      return returnResponse(res, 400, {
        error: constants.WRONG_CREDENTIALS_TYPE,
        errorMessage: constants.WRONG_CREDENTIALS,
      });
    }

    let decodedPassword = await decryptPassword(
      reqBody.password,
      userInfo.password
    );

    if (!decodedPassword) {
      return returnResponse(res, 400, {
        error: constants.WRONG_CREDENTIALS_TYPE,
        errorMessage: constants.WRONG_PASSWORD,
      });
    }

    if (!userInfo.status == "inactive") {
      return returnResponse(res, 400, {
        error: constants.INACTIVE_USER_ERROR,
        errorMessage: constants.INACTIVE_USER,
      });
    }

    let { id, name, email, uid } = userInfo;

    let tokenData = {
      id,
      name,
      email,
      uid,
      tokenType: "login",
    };

    if (!userInfo.emailVerified) {
      tokenData.tokenType = "verify";
      tokenData.hashToken = hashToken;
    }
    let jwtTokenData = JWTSign(tokenData);
    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }

    let { notificationId } = reqBody;
    if (notificationId) {
      await userService.updateOne({ uid }, { notificationId });
    }
    let message = constants.LOGIN_SUCCESS;
    let data = {
      ...jwtTokenData,
    };
    if (tokenData.tokenType == "verify") {
      message = constants.EMAIL_NOT_VERIFIED;
      data = {
        verification_token: jwtTokenData.accessToken,
      };
    }
    return returnResponse(res, 200, {
      message,
      ...data,
    });
  } catch (error) {
    console.log(`Internal error accrued in signup controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.googleLogin = async (req, res) => {
  let reqBody = req.body || {};
  let language = req.locals.language;
  let socialType = "google";

  const constants = await languageHelper(language);
  try {
    let validation = await googleLoginValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }
    let tokenData = await firebaseService.verifyToken(reqBody.token);

    if (!tokenData) {
      return returnResponse(res, 400, {
        error: constants.TOKEN_INVALID_ERROR,
        errorMessage: constants.INVALID_TOKEN,
      });
    }

    let { name, uid: socialId, email, picture: profileImage } = tokenData;

    let userInfo = await userService.findOne({
      socialId,
      socialType,
    });

    let jwtData = {
      tokenType: "login",
      name,
      email,
    };

    if (userInfo) {
      jwtData.uid = userInfo.uid;
      if (!userInfo.status == "inactive") {
        return returnResponse(res, 400, {
          error: constants.INACTIVE_USER_ERROR,
          errorMessage: constants.INACTIVE_USER,
        });
      }
    } else {
      let insertData = {
        name,
        email,
        socialId,
        socialType,
        profileImage,
        emailVerified: true,
      };
      let result = await userService.insert(insertData);
      jwtData.uid = result.uid;
    }

    let jwtTokenData = JWTSign(jwtData);

    if (!jwtTokenData.status) {
      return returnResponse(res, 500, {
        error: constants.SOMETHING_WENT_WRONG_TYPE,
        errorMessage: constants.SOMETHING_WENT_WRONG,
      });
    }
    let { notificationId } = reqBody;
    if (notificationId) {
      await userService.updateOne({ uid: jwtData.uid }, { notificationId });
    }

    return returnResponse(res, 200, {
      message: constants.LOGIN_SUCCESS,
      ...jwtTokenData,
    });
  } catch (error) {
    console.log(`Internal error accrued in signup controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};
