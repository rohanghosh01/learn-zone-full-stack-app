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

module.exports.uploadValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    content: "required",
    type: "required",
  };
  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
