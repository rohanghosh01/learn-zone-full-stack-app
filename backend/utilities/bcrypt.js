const bcrypt = require("bcrypt");
const secretJson = require("../config/config.json");
const secretEnvironment = require("../config/config.json")[
  secretJson.ENVIRONMENT
];
const config = secretEnvironment;

// Encryption and decryption functions
module.exports.encryptPassword = (value) => {
  return bcrypt.hashSync(value.toString(), parseInt(config.BCRYPT_SALT_ROUND));
};
module.exports.decryptPassword = async (value1, value2) => {
  return await bcrypt.compare(value1, value2);
};
