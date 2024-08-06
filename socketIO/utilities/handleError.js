const errorLog = require("../utilities/errorLog");
const handler = async (event, context) => {
  let error = context.prev;
  errorLog("error in utilities/handleError", error);

  let body = error ? error.body : JSON.stringify({ error: "Internal issue" });
  let statusCode = error.statusCode ? error.statusCode : 500;
  return {
    statusCode,
    cors: { "Access-Control-Allow-Origin": "*" },
    body,
  };
};
module.exports = { handler };
