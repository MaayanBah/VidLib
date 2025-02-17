require("express-async-errors");
const winston = require("winston");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
