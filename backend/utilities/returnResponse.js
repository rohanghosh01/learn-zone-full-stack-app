const returnResponse = (res, statusCode = 204, body = {}) => {
  return res.status(statusCode).send(body);
};
module.exports = returnResponse;
