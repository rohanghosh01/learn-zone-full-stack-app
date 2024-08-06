const returnResponse = require("../../utilities/returnResponse");
const { feedCommentValidation } = require("../../validators/feed.validator");
const feedCommentService = require("../../services/feedComment.service");
const feedService = require("../../services/feed.service");
const languageHelper = require("../../utilities/language.utilities");
// const { getCache, setCache, deleteCache } = require("../../utilities/redis");

module.exports.create = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let { comment = "", parentId = null } = reqBody;
  let userId = req.locals.userData.uid;
  let feedId = req.params?.id || "";
  const constants = await languageHelper(language);
  try {
    let validation = await feedCommentValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    let getFeed = await feedService.findOne({ uid: feedId });
    if (!getFeed) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_NOT_FOUND,
      });
    }

    if (parentId) {
      let getComment = await feedCommentService.findOne({
        feedId,
        uid: parentId,
      });
      if (!getComment) {
        return returnResponse(res, 404, {
          error: constants.NOT_FOUND,
          errorMessage: constants.FEED_COMMENT_NOT_FOUND,
        });
      }
    }
    let totalComments = getFeed.totalComments + 1;

    await Promise.all([
      feedCommentService.insert({ comment, parentId, userId, feedId }),
      feedService.updateOne({ uid: feedId }, { totalComments }),
    ]);

    return returnResponse(res, 200, {
      message: constants.FEED_COMMENT,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed comment controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.update = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let { comment = "" } = reqBody;
  let userId = req.locals.userData.uid;
  let feedId = req.params?.id || "";
  let commentId = req.params?.commentId || "";
  const constants = await languageHelper(language);
  try {
    let validation = await feedCommentValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    let getFeed = await feedService.findOne({ uid: feedId });
    if (!getFeed) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_NOT_FOUND,
      });
    }
    let where = {
      uid: commentId,
      userId,
      feedId,
    };
    let getComment = await feedCommentService.findOne(where);

    if (!getComment) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_COMMENT_NOT_FOUND,
      });
    }

    await feedCommentService.updateOne(where, { comment });

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed comment controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.delete = async (req, res) => {
  let language = req.locals.language;
  let userId = req.locals.userData.uid;
  let uid = req.query?.commentId || "";
  let feedId = req.params?.feedId || "";
  const constants = await languageHelper(language);
  try {
    let where = {
      uid,
      userId,
      feedId,
    };
    let getFeed = await feedService.findOne({ uid: feedId });
    let getComment = await feedCommentService.findOne(where);
    let totalComments = getFeed.totalComments - 1;

    if (!getComment) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.FEED_COMMENT_NOT_FOUND,
      });
    }

    await feedCommentService.delete(where);
    await feedService.updateOne({ uid: feedId }, { totalComments });

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
    });
  } catch (error) {
    console.log(`Internal error accrued in feed comment controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.list = async (req, res) => {
  let language = req.locals.language;
  let {
    limit = "10",
    offset = "0",
    search = "",
    status = "active",
    orderBy = "id",
    orderType = "DESC",
  } = req.query || {};
  let feedId = req.params?.id || "";
  let userId = req.locals.userData.uid;

  const constants = await languageHelper(language);
  try {
    let whereData = {
      // status,
      limit,
      offset,
      search,
      userId,
      orderBy,
      orderType,
      feedId,
    };

    let { result, count } = await feedCommentService.getAll(whereData);

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

module.exports.likeDislike = async (req, res) => {
  let language = req.locals.language;
  let feedId = req.params?.id || "";
  let commentId = req.query?.commentId || "";

  let userId = req.locals.userData.uid;
  const constants = await languageHelper(language);
  try {
    let getFeedComment = await feedCommentService.findOne({
      uid: commentId,
      feedId,
    });
    if (!getFeedComment) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.COMMENT_NOT_FOUND,
      });
    }

    let where = {
      userId,
      feedId,
      commentId,
    };

    let getLike = await feedCommentService.findLike(where);

    let updateArr = [];
    let message = constants.COMMENT_LIKE;
    let totalLikes = getFeedComment.totalLikes + 1;

    if (getLike) {
      updateArr.push(feedCommentService.deleteLike(where));
      message = constants.COMMENT_DISLIKE;
      totalLikes = getFeedComment.totalLikes - 1;
    } else {
      updateArr.push(feedCommentService.insertLike(where));
    }

    updateArr.push(
      feedCommentService.updateOne({ feedId, uid: commentId }, { totalLikes })
    );
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
