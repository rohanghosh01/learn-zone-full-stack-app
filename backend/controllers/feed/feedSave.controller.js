const returnResponse = require("../../utilities/returnResponse");
const { feedCreateValidation } = require("../../validators/feed.validator");
const feedSaveService = require("../../services/feedSave.service");
const feedService = require("../../services/feed.service");
const languageHelper = require("../../utilities/language.utilities");

module.exports.saveUnSave = async (req, res) => {
  let language = req.locals.language;
  let feedId = req.params?.id || "";
  let userId = req.locals.userData.uid;
  const constants = await languageHelper(language);
  try {
    let getFeed = await feedService.findOne({ uid: feedId });
    if (!getFeed) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_NOT_FOUND,
      });
    }

    let getSave = await feedSaveService.findOne({ userId, feedId });

    let updateArr = [];
    let message = constants.FEED_SAVED;
    let totalSaved = getFeed.totalSaved + 1;

    if (getSave) {
      updateArr.push(feedSaveService.delete({ userId, feedId }));
      message = constants.FEED_UNSAVED;
      totalSaved = getFeed.totalSaved - 1;
    } else {
      updateArr.push(feedSaveService.insert({ userId, feedId }));
    }

    updateArr.push(feedService.updateOne({ uid: feedId }, { totalSaved }));
    await Promise.all(updateArr);

    return returnResponse(res, 200, {
      message,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed like controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.list = async (req, res) => {
  let language = req.locals.language;
  let userId = req.locals.userData.uid;
  let {
    limit = "10",
    offset = "0",
    search = "",
    status = "active",
    orderBy = "id",
    orderType = "desc",
  } = req.query || {};

  const constants = await languageHelper(language);
  try {
    let whereData = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      search,
      userId,
      orderBy,
      orderType,
    };

    let { result, count } = await feedSaveService.getAll(whereData);

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
    console.log(`Internal error accrued in feed save list controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};
