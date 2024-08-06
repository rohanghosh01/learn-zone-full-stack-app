const client = require("../config/redis");
const secretJson = require("../config/config.json");
const secretEnvironment = require("../config/config.json")[
  secretJson.ENVIRONMENT
];
const config = secretEnvironment;
const REDIS_STATUS = config.REDIS_STATUS;

module.exports.setCache = async (id, data) => {
  try {
    if (REDIS_STATUS == "1") {
      await client.set(id, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.log(">>>>>>>>>setCache", error);
    return false;
  }
};

module.exports.getCache = async (id) => {
  try {
    if (REDIS_STATUS == "1") {
      let data = await client.get(id);
      return JSON.parse(data);
    }
    return false;
  } catch (error) {
    console.log(">>>>>>getCache", error);
    return false;
  }
};

module.exports.deleteCache = async (id) => {
  try {
    await client.del(id);
  } catch (error) {
    console.log(">>>>>>deleteCache", error);
    return false;
  }
};
