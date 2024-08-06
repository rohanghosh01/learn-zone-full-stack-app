const errorLog = (name, error) => {
  return console.log(`\x1b[31m [${name}] \x1b[0m`, error);
};

const infoLog = (name, message) => {
  return console.log(`\x1b[33m [${name}] \x1b[0m`, message);
};

module.exports = { errorLog, infoLog };
