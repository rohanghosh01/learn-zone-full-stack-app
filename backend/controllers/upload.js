const languageHelper = require("../utilities/language.utilities");
const returnResponse = require("../utilities/returnResponse");
const { uploadValidation } = require("../validators/upload.validator");
const firebaseService = require("../services/firebase.service");

module.exports.handler = async (event, context) => {
  let language = event.locals.language;
  const constants = await languageHelper(language);

  try {
    let reqBody = event.body;
    console.log('>>>>>>>>>>>>>>>>>>>log',event)

    await firebaseService.upload(reqBody);

    return returnResponse(200, {
      message: constants.SUCCESS_MESSAGE,
      data: {
        /* your processed data */
      },
    });
  } catch (error) {
    console.log("Internal error occurred in controller", error);

    return returnResponse(500, {
      error: constants.SOMETHING_WENT_WRONG_TYPE,
      errorMessage: constants.SOMETHING_WENT_WRONG,
    });
  }
};
