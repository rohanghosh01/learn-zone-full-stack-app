/**
 * based on header language passed msg file data
 *
 */
const constants = require("./../constants");

const langHelper = (res) => {
  try {
    const userLanguage = res.locals.language;
    return constants[userLanguage];
  } catch (err) {
    return constants["en"];
  }
};

// export data to use in other files
module.exports = langHelper;
