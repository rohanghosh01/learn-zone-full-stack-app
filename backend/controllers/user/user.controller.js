const returnResponse = require("../../utilities/returnResponse");
const {
  changePasswordValidation,
} = require("../../validators/signUp.validator");
const userService = require("../../services/user.service");
const languageHelper = require("../../utilities/language.utilities");
const crypto = require("crypto");
const { encryptPassword, decryptPassword } = require("../../utilities/bcrypt");

module.exports.profile = async (req, res) => {
  let language = req.locals.language;
  let id = req.query?.id || "";
  let uid = req.locals.userData.uid;
  if (id) {
    uid = id;
  }

  const constants = await languageHelper(language);
  try {
    let result = await userService.detail(uid);

    if (!result) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.USER_NOT_FOUND,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      result,
    });
  } catch (error) {
    console.log(`Internal error accrued in signup controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  let language = req.locals.language;
  let uid = req.locals.userData.uid;
  let reqBody = req.body || {};
  const constants = await languageHelper(language);
  try {
    const updateFields = [
      "name",
      "about",
      "dob",
      "status",
      "isPrivate",
      "profileImage",
    ];
    let updateData = {};

    let { userName } = reqBody;
    if (userName) {
      if (!userName.includes("@")) {
        userName = `@${userName}`;
      }

      let checkUserName = await userService.findOne({
        userName,
        uid: { $ne: uid },
      });

      if (checkUserName) {
        return returnResponse(res, 400, {
          error: constants.VALIDATION_TYPE_ERROR,
          errorMessage: constants.USERNAME_EXIST_ERROR,
        });
      }
      updateData.userName = userName;
    }

    updateFields.forEach((field) => {
      if (reqBody[field]) {
        updateData[field] = reqBody[field];
      }
    });

    let updated = await userService.updateOne({ uid }, updateData);
    return returnResponse(res, 200, {
      message: constants.SUCCESS_PROFILE_UPDATE,
    });
  } catch (error) {
    console.log(`Internal error accrued in signup controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.changePassword = async (req, res) => {
  let language = req.locals.language;
  let uid = req.locals.userData.uid;
  let reqBody = req.body || {};
  const constants = await languageHelper(language);
  try {
    let validation = await changePasswordValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    let { password, newPassword } = reqBody;

    let encryptedNewPass = encryptPassword(newPassword);

    let getUser = await userService.findOne({
      uid,
    });

    let matchPassword = await decryptPassword(password, getUser.password);

    if (!matchPassword) {
      return returnResponse(res, 400, {
        error: constants.WRONG_CREDENTIALS_TYPE,
        errorMessage: constants.WRONG_PASSWORD,
      });
    }
    if (password === newPassword) {
      return returnResponse(res, 400, {
        error: constants.WRONG_CREDENTIALS_TYPE,
        errorMessage: constants.SAME_PASSWORD,
      });
    }

    let updated = await userService.updateOne(
      { uid },
      { password: encryptedNewPass }
    );
    return returnResponse(res, 200, {
      message: constants.SUCCESS_PASSWORD_CHANGE,
    });
  } catch (error) {
    console.log(`Internal error accrued in changePassword controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.userList = async (req, res) => {
  let language = req.locals.language;
  let {
    limit = "10",
    offset = "0",
    search = "",
    status = "active",
    orderBy = "id",
    orderType = "desc",
  } = req.query || {};
  let uid = req.locals.userData.uid;

  const constants = await languageHelper(language);
  try {
    let whereData = {
      status,
      limit,
      offset,
      search,
      uid,
      orderBy,
      orderType,
    };

    let { result, count } = await userService.userList(whereData);

    if (!result) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.RECORD_NOT_FOUND,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      count,
      results: result,
    });
  } catch (error) {
    console.log(`Internal error accrued in signup controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};
