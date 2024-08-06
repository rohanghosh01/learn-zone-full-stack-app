const returnResponse = (statusCode = 204, body = {}) => {
  return {
    statusCode,
    cors: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  };
};
module.exports = returnResponse;
