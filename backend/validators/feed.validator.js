const Validator = require("validatorjs");
const languageUtility = require("../utilities/language.utilities");

const extractErrors = (validator, rules) => {
  return Object.keys(rules)
    .filter((field) => validator.errors.first(field))
    .map((field) => ({
      field,
      errorMessage: validator.errors.first(field),
    }));
};

const returnValue = (errorArr, constants) => ({
  error: constants.VALIDATION_TYPE_ERROR,
  errorMessage: errorArr.length > 0 ? errorArr[0].errorMessage : null,
});

module.exports.feedCreateValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    description: "required",
    content: "required",
  };

  if (data.description && !data.content) {
    rules.content = "optional";
  }
  if (data.content && !data.description) {
    rules.description = "optional";
  }

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
module.exports.feedCommentValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    comment: "required",
  };
  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
