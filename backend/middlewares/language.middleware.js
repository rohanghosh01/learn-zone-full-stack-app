const { infoLog } = require("./../utilities/errorLog");
const handler = (req, res, next) => {
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  infoLog("request", {
    method: req.method,
    endpoint: `${req.headers.host}${req.path}`,
    ip,
    time: new Date().toLocaleString(),
  });
  let language = req?.headers?.language || "en";
  req.locals = req.locals || {}; // Ensure req.locals is initialized
  req.locals.language = language;
  next();
};

module.exports = handler;
