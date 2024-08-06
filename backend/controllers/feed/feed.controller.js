const returnResponse = require("../../utilities/returnResponse");
const { feedCreateValidation } = require("../../validators/feed.validator");
const feedService = require("../../services/feed.service");
const languageHelper = require("../../utilities/language.utilities");
const userService = require("../../services/user.service");
module.exports.create = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let userId = req.locals.userData.uid;
  const constants = await languageHelper(language);
  try {
    let validation = await feedCreateValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    reqBody.userId = userId;
    reqBody.createdAt = new Date();

    let result = await feedService.insert(reqBody);
    let getUser = await userService.detail(userId);
    let totalPosts = getUser.totalPosts + 1;
    await userService.updateOne({ uid: userId }, { totalPosts });
    let { _id, uid, ...finalResult } = result._doc;
    finalResult.id = uid;
    return returnResponse(res, 200, {
      message: constants.SUCCESS_FEED_CREATE,
      result: finalResult,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed create controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.detail = async (req, res) => {
  let language = req.locals.language;
  let uid = req.params?.id || "";

  const constants = await languageHelper(language);
  try {
    let result = await feedService.detail(uid);

    if (!result) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_NOT_FOUND,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      result,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed detail controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.update = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let uid = reqBody.uid;
  let cacheId = `feed-session:${uid}`;
  const constants = await languageHelper(language);
  try {
    let getFeed = await feedService.findOne({ uid });
    if (!getFeed) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_NOT_FOUND,
      });
    }

    const updateFields = ["title", "description", "status", "content"];
    let updateData = {};

    updateFields.forEach((field) => {
      if (reqBody[field]) {
        updateData[field] = reqBody[field];
      }
    });

    let updated = await feedService.updateOne({ uid }, updateData);
    return returnResponse(res, 200, {
      message: constants.SUCCESS_FEED_UPDATE,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed update controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.delete = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let uid = req.params?.id || "";
  let userId = req.locals.userData.uid;
  let cacheId = `feed-session:${uid}`;
  const constants = await languageHelper(language);
  try {
    let where = {
      uid,
      userId,
    };
    let getFeed = await feedService.findOne(where);
    console.log(">>>>>>>>>>>>>>>>>>>log", getFeed);
    if (!getFeed) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_NOT_FOUND,
      });
    }

    await feedService.delete(where);
    return returnResponse(res, 200, {
      message: constants.SUCCESS,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed update controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.list = async (req, res) => {
  let language = req.locals.language;
  let loggedId = req.locals.userData.uid;
  let {
    limit = "10",
    offset = "0",
    search = "",
    status = "active",
    orderBy = "id",
    orderType = "desc",
    userId = "",
  } = req.query || {};

  const constants = await languageHelper(language);
  try {
    let whereData = {
      status,
      limit: parseInt(limit),
      offset: parseInt(offset),
      search,
      userId,
      orderBy,
      orderType,
      loggedId,
    };

    let { result, count } = await feedService.feedList(whereData);

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
