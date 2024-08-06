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

module.exports.signUpValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    firstName: "required",
    lastName: "required",
    email: "required|email",
    userName: "required",
    password: "required|min:6|max:50",
  };
  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};

module.exports.loginValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    email: "required|email",
    password: "required|min:6|max:50",
  };
  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
module.exports.verifyValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    otp: "required",
  };

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
module.exports.resetValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    password: "required",
  };

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};

module.exports.forgotPasswordValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    email: "required|email",
  };

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};

module.exports.googleLoginValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    token: "required",
  };

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
module.exports.changePasswordValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    password: "required",
    newPassword: "required",
  };

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};

module.exports.usernameValidation = async (myLang, data) => {
  const constants = await languageUtility(myLang);

  const rules = {
    username: "required",
  };

  const validator = new Validator(data, rules);

  if (validator.fails()) {
    const multiErrors = extractErrors(validator, rules);
    return returnValue(multiErrors, constants);
  }

  return false;
};
