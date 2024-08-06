const returnResponse = require("../../utilities/returnResponse");

const chatService = require("../../services/chat.service");
const languageHelper = require("../../utilities/language.utilities");
const generateUUID = require("../../utilities/uuidGenerate");
const {
  groupValidation,
  updateGroupValidation,
} = require("../../validators/chat.validator");
module.exports.create = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let uid = req.locals.userData.uid;

  let userId = reqBody.userId;
  let type = reqBody.type || "user";

  const constants = await languageHelper(language);
  try {
    let connectionId = `${type}-${generateUUID()}`;

    let insertData = {
      connectionId,
      userId: uid,
      receiverId: userId,
    };

    console.log(">>insertData", insertData);

    let result = await chatService.findOne(uid, userId);

    if (result) {
      return returnResponse(res, 200, {
        message: constants.SUCCESS,
        connection_exist: true,
        connectionId: result.connectionId,
      });
    } else {
      await chatService.insert(insertData);
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      connection_exist: false,
      connectionId: connectionId,
    });
  } catch (error) {
    console.log(`Internal error accrued in create chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.createGroup = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let uid = req.locals.userData.uid;

  let {
    members = null,
    name = "",
    type = "group",
    groupImage = null,
  } = reqBody;

  const constants = await languageHelper(language);
  try {
    let validation = await groupValidation(language, reqBody);
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    members.push(uid);

    let connectionId = `${type}-${generateUUID()}`;

    let insertData = {
      connectionId,
      groupName: name,
      userId: uid,
      members,
      receiverId: members.join(","),
      isGroup: true,
      groupImage,
    };

    console.log(">>insertData", insertData);

    // let result = await chatService.findOne(uid, userId);

    // if (result) {
    //   return returnResponse(res,200, {
    //     message: constants.SUCCESS,
    //     connection_exist: true,
    //     connectionId: result.connectionId,
    //   });
    // } else {

    // }

    await chatService.insert(insertData);

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      connectionId: connectionId,
    });
  } catch (error) {
    console.log(`Internal error accrued in create chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.list = async (req, res) => {
  let language = req.locals.language;
  let connectionId = req.params?.connectionId || "";
  let userId = req.locals.userData.uid;

  let { limit = "10", offset = "0", search = "" } = req.query || {};

  const constants = await languageHelper(language);
  try {
    let { result = [], count = 0 } = await chatService.chatList({
      connectionId,
      limit,
      offset,
      userId,
    });

    if (!result.length) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.CHAT_NOT_FOUND,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      count,
      result: result[0],
    });
  } catch (error) {
    console.log(`Internal error accrued in get chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.myMessages = async (req, res) => {
  let language = req.locals.language;
  let uid = req.locals.userData.uid;

  let {
    limit = "10",
    offset = "0",
    search = "",
    tab = "all",
  } = req.query || {};

  const constants = await languageHelper(language);
  try {
    let { result = [], count = 0 } = await chatService.messageList({
      userId: uid,
      limit,
      offset,
      tab,
    });

    if (!result.length) {
      return returnResponse(res, 404, {
        error: constants.NOT_FOUND,
        errorMessage: constants.CHAT_NOT_FOUND,
      });
    }

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
      count,
      result,
    });
  } catch (error) {
    console.log(`Internal error accrued in get chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.updateGroup = async (req, res) => {
  let language = req.locals.language;
  let reqBody = req.body || {};
  let uid = req.locals.userData.uid;

  let { members = [], name = "", groupImage = null, connectionId } = reqBody;

  const constants = await languageHelper(language);
  try {
    let validation = await updateGroupValidation(language, { connectionId });
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    let updateData = {};

    let result = await chatService.findGroup(connectionId, uid);

    if (!result) {
      return returnResponse(res, 404, {
        message: constants.NOT_FOUND,
      });
    }

    if (members.length) {
      updateData = {
        $push: { members },
      };
    }
    if (name) {
      updateData.groupName = name;
    }
    if (groupImage) {
      updateData.groupImage = groupImage;
    }

    if (!Object.keys(updateData).length) {
      return returnResponse(res, 409, {
        message: constants.VALIDATION_TYPE_ERROR,
      });
    }

    await chatService.updateGroup(
      { connectionId, userId: uid, isGroup: true },
      updateData
    );

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
    });
  } catch (error) {
    console.log(`Internal error accrued in create chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.leaveGroup = async (req, res) => {
  let language = req.locals.language;
  let uid = req.locals.userData.uid;
  let connectionId = req.params.connectionId;

  const constants = await languageHelper(language);
  try {
    let validation = await updateGroupValidation(language, { connectionId });
    if (validation) {
      return returnResponse(res, 400, validation);
    }
    updateData = {
      $pull: { members: uid },
    };
    await chatService.removeMember(
      {
        connectionId,
        isGroup: true,
        userId: { $ne: uid },
      },
      updateData
    );

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
    });
  } catch (error) {
    console.log(`Internal error accrued in create chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};
module.exports.deleteGroup = async (req, res) => {
  let language = req.locals.language;
  let uid = req.locals.userData.uid;
  let connectionId = req.params.connectionId;

  const constants = await languageHelper(language);
  try {
    let validation = await updateGroupValidation(language, { connectionId });
    if (validation) {
      return returnResponse(res, 400, validation);
    }

    await chatService.deleteGroup({
      connectionId,
      isGroup: true,
      userId: uid,
    });

    return returnResponse(res, 200, {
      message: constants.SUCCESS,
    });
  } catch (error) {
    console.log(`Internal error accrued in create chat controller`, error);
    return returnResponse(res, 500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};
